import React, { ReactElement, useState } from "react";
import { Formik, Field } from "formik";
import { InputField } from "../components/InputField";
import { useForgotPasswordMutation } from "../graphql/generated/graphql";

function ForgotPassword(): ReactElement {
  const [status, setStatus] = useState(false as boolean | null);
  const [forgotPassword] = useForgotPasswordMutation();

  if (status === null) {
    return <h1>Loading...</h1>;
  }
  if (status === true) {
    return <h1>Check your email to reset your password!</h1>;
  }

  return (
    <div>
      <h1>Forgot Password</h1>
      <Formik
        onSubmit={async ({ email }, { setErrors }) => {
          const res = await forgotPassword({ variables: { email } });
          if (res && res.data && !res.data.forgotPassword) {
            setErrors({ email: "Invalid Login" });
            return;
          }
          setStatus(true);
        }}
        initialValues={{ email: "" }}
      >
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Field
              label="Email"
              name="email"
              placeholder="email"
              component={InputField}
            />
            <button type="submit">Forgot Password</button>
          </form>
        )}
      </Formik>
    </div>
  );
}

export default ForgotPassword;
