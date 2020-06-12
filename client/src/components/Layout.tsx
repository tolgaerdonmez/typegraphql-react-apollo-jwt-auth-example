import React, { ReactNode } from "react";
import Navbar from "./Navbar";
import "../sass/Layout.scss";
interface Props {
  children?: ReactNode;
}

const Layout = (props: Props) => {
  return (
    <div className="layout-container">
      <header>
        <Navbar />
      </header>
      <div className="layout-children-container">{props.children}</div>
    </div>
  );
};

export default Layout;
