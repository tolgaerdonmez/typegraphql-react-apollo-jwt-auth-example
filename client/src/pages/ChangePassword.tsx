import React, { useState } from "react";
import { RouteComponentProps, Redirect } from "react-router-dom";
import { useChangePasswordMutation } from "../graphql/generated/graphql";
import { Formik, Field } from "formik";
import { InputField } from "../components/InputField";

const ChangePassword = ({
  match: {
    params: { token },
  },
}: RouteComponentProps<{ token: string }>) => {
  const [status, setStatus] = useState(null as boolean | null);
  const [confirm] = useChangePasswordMutation();

  if (!token) return <Redirect to="/" />;

  if (status === true) {
    return <h1>Password Changed! You will be redirected to homepage</h1>;
  } else if (status === false) {
    return <h1>Invalid token, go to forgot password page again!</h1>;
  }

  return (
    <>
      <h1>Change Password</h1>
      <Formik
        onSubmit={async ({ password }) => {
          const res = await confirm({
            variables: { data: { token, password } },
          });
          if (res && res.data && !res.data.changePassword) {
            setStatus(false);
            return;
          } else if (res.data && res.data.changePassword) setStatus(true);
        }}
        initialValues={{ password: "" }}
      >
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Field
              type="password"
              label="Password"
              name="password"
              placeholder="password"
              component={InputField}
            />
            <button type="submit">Change Password</button>
          </form>
        )}
      </Formik>
    </>
  );
};

export default ChangePassword;
