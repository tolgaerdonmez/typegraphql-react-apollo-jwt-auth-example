import React, { Component, createContext } from "react";
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import { onError } from "apollo-link-error";
import { ApolloLink, Observable } from "apollo-link";
import { TokenRefreshLink } from "apollo-link-token-refresh";
import jwtDecode from "jwt-decode";

interface Props {}
interface State {
  accessToken: string;
  client?: ApolloClient<any>;
  status: boolean;
}

export interface UserContextInterface {
  state: State;
  actions: {
    refreshAccessToken: () => void;
    updateAccessToken: (token: string) => void;
  };
}

export const UserContext = createContext({} as UserContextInterface);

export default class UserContextProvider extends Component<Props, State> {
  state: State = { accessToken: "", client: undefined, status: false };

  async componentDidMount() {
    await this.refreshAccessToken();
    this.initApollo();
    this.setState({ status: true });
  }

  componentDidUpdate(_: any, prevState: State) {
    if (prevState.accessToken !== this.state.accessToken) {
      this.initApollo();
    }
  }

  initApollo = () => {
    const cache = new InMemoryCache({});

    const requestLink = new ApolloLink(
      (operation, forward) =>
        new Observable((observer) => {
          let handle: any;
          Promise.resolve(operation)
            .then((operation) => {
              if (this.state.accessToken.length) {
                operation.setContext({
                  headers: {
                    authorization: `bearer ${this.state.accessToken}`,
                  },
                });
              }
            })
            .then(() => {
              handle = forward(operation).subscribe({
                next: observer.next.bind(observer),
                error: observer.error.bind(observer),
                complete: observer.complete.bind(observer),
              });
            })
            .catch(observer.error.bind(observer));

          return () => {
            if (handle) handle.unsubscribe();
          };
        })
    );

    const client = new ApolloClient({
      link: ApolloLink.from([
        new TokenRefreshLink({
          accessTokenField: "accessToken",
          isTokenValidOrUndefined: () => {
            const token = this.state.accessToken;

            if (!token.length) {
              return true;
            }

            try {
              const { exp } = jwtDecode(token);

              if (Date.now() >= exp * 1000) {
                return false;
              } else {
                return true;
              }
            } catch {
              return false;
            }
          },
          fetchAccessToken: () => {
            return fetch("http://localhost:4000/refresh_token", {
              method: "POST",
              credentials: "include",
            });
          },
          handleFetch: (accessToken) => {
            this.updateAccessToken(accessToken);
          },
          handleError: (err) => {
            this.updateAccessToken("");
            // console.warn("Your refresh token is invalid. Try to relogin");
            // console.error(err);
          },
        }) as any,
        onError(({ graphQLErrors, networkError }) => {
          console.log(graphQLErrors);
          console.log(networkError);
        }),
        requestLink,
        new HttpLink({
          uri: "http://localhost:4000/graphql",
          credentials: "include",
        }),
      ]),
      cache,
    });

    this.setState({ client });
  };

  refreshAccessToken = async () => {
    const res = await fetch("http://localhost:4000/refresh_token", {
      method: "POST",
      credentials: "include",
    }).then((res) => res.json());
    if (res.accessToken) this.updateAccessToken(res.accessToken);
  };

  updateAccessToken = (token: string) => {
    this.setState({ accessToken: token });
  };

  render() {
    if (!this.state.status) return <h1>Loading...</h1>;
    const context: UserContextInterface = {
      state: this.state,
      actions: { ...this },
    };
    return (
      <UserContext.Provider value={context}>
        {this.props.children}
      </UserContext.Provider>
    );
  }
}
