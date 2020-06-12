import React, { ReactElement } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Me from "./pages/Me";
import Confirm from "./pages/Confirm";
import ForgotPassword from "./pages/ForgotPassword";
import ChangePassword from "./pages/ChangePassword";
import Layout from "./components/Layout";

export default function Routes(): ReactElement {
  return (
    <BrowserRouter>
      <Layout>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/user/login" component={Login} />
          <Route exact path="/user/register" component={Register} />
          <Route exact path="/user/confirm/:token" component={Confirm} />
          <Route
            exact
            path="/user/forgot-password"
            component={ForgotPassword}
          />
          <Route
            path="/user/change-password/:token?"
            component={ChangePassword}
          />

          <Route exact path="/me" component={Me} />
        </Switch>
      </Layout>
    </BrowserRouter>
  );
}
