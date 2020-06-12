import React, { ReactElement, useState } from "react";
import { useRegisterMutation } from "../graphql/generated/graphql";
import { Formik, Field } from "formik";
import { InputField } from "../components/InputField";

function Register(): ReactElement {
  const [register] = useRegisterMutation();
  const [status, setStatus] = useState(false as boolean | null); // false -> empty | null -> loading | true -> email sent

  if (status === true) {
    return <h1>Check your email!</h1>;
  }

  return (
    <>
      <h1>Register</h1>
      <Formik
        onSubmit={async (data, { setErrors }) => {
          try {
            setStatus(null);
            const res = await register({
              variables: {
                data,
              },
            });
            if (res.data) {
              setStatus(true);
            }
          } catch (err) {
            const errors: { [key: string]: string } = {};
            err.graphQLErrors[0].extensions.exception.validationErrors.forEach(
              (validationErr: any) => {
                Object.values(validationErr.constraints).forEach(
                  (message: any) => {
                    errors[validationErr.property] = message;
                  }
                );
              }
            );
            setErrors(errors);
            setStatus(false);
          }
        }}
        initialValues={{ email: "", firstName: "", lastName: "", password: "" }}
      >
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Field
              disabled={status === null}
              label="First Name"
              name="firstName"
              placeholder="firstName"
              component={InputField}
            />
            <Field
              disabled={status === null}
              label="Last Name"
              name="lastName"
              placeholder="lastName"
              component={InputField}
            />
            <Field
              disabled={status === null}
              label="Email"
              name="email"
              placeholder="email"
              component={InputField}
            />
            <Field
              disabled={status === null}
              label="Password"
              name="password"
              placeholder="password"
              type="password"
              component={InputField}
            />
            <button disabled={status === null} type="submit">
              Register
            </button>
          </form>
        )}
      </Formik>
    </>
  );
}

export default Register;
