import React, { ReactElement, useContext } from "react";
import { useLoginMutation } from "../graphql/generated/graphql";
import { RouteComponentProps, Link } from "react-router-dom";
import { Field, Formik } from "formik";
import { InputField } from "../components/InputField";
import { UserContext } from "../context/UserContext";

function Login(props: RouteComponentProps): ReactElement {
  const [login] = useLoginMutation();
  const userContext = useContext(UserContext);

  return (
    <>
      <h1>Login</h1>
      <Formik
        onSubmit={async (data, { setErrors }) => {
          try {
            const res = await login({
              variables: data,
            });
            if (res.data?.login.accessToken) {
              userContext.actions.updateAccessToken(res.data.login.accessToken);
              props.history.push("/");
            }
          } catch (err) {
            console.log(err);
            setErrors({ email: "Invalid Login" });
          }
          const res = await login({
            variables: data,
          });
          if (res && res.data && !res.data.login) {
            return;
          }
        }}
        initialValues={{ email: "", password: "" }}
      >
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Field
              label="Email"
              name="email"
              placeholder="email"
              component={InputField}
            />
            <Field
              label="Password"
              name="password"
              placeholder="password"
              type="password"
              component={InputField}
            />
            <Link to="/user/forgot-password" className="forgot-password-link">
              forgot password?
            </Link>
            <button type="submit">Login</button>
          </form>
        )}
      </Formik>
    </>
  );
}

export default Login;
