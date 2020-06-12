import React, { ReactElement, useContext } from "react";

import { ApolloProvider } from "@apollo/react-hooks";
import Routes from "./Routes";
import { UserContext } from "./context/UserContext";

function App(): ReactElement {
  const { state } = useContext(UserContext);

  if (!state.client) {
    return <h1>Loading...</h1>;
  }

  return (
    <ApolloProvider client={state.client}>
      <Routes />
    </ApolloProvider>
  );
}

export default App;
