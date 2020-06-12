import React, { ReactElement } from "react";
import { useMeQuery } from "../graphql/generated/graphql";

function Me(): ReactElement {
  const { data, loading, error } = useMeQuery();

  if (error) {
    return <h1>{error.message}</h1>;
  }
  if (!data || !data.me || loading) {
    return <h1>Loading...</h1>;
  }
  return (
    <ul>
      <li>
        {data.me.firstName} {data.me.lastName}
      </li>
      <li>{data.me.email}</li>
    </ul>
  );
}

export default Me;
