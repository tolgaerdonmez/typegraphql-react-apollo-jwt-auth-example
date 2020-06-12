import React, { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { useConfirmUserMutation } from "../graphql/generated/graphql";

const Confirm = (props: RouteComponentProps<{ token: string }>) => {
  const [status, setStatus] = useState(null as boolean | null);

  const [confirm] = useConfirmUserMutation({
    variables: { token: props.match.params.token },
  });

  useEffect(() => {
    if (!props.history || !confirm) return;
    confirm().then(({ data, errors }) => {
      if (data?.confirmUser && !errors) {
        setStatus(true);
        setTimeout(() => {
          props.history.replace("/");
        }, 1000);
        return;
      }
      setStatus(false);
    });
  }, [props.history, confirm]);

  if (status === null) {
    return <h1>Loading...</h1>;
  }
  if (status === false) {
    return <h1>Invalid token!</h1>;
  }

  return <h1>Account confirmed! You will be redirected to homepage</h1>;
};

export default Confirm;
