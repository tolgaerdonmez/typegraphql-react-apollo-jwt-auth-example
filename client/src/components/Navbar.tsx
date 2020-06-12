import React, { useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { useMeQuery, useLogoutMutation } from "../graphql/generated/graphql";
import { UserContext } from "../context/UserContext";
import "../sass/Navbar.scss";

const Navbar = () => {
  const [logout] = useLogoutMutation();
  const { actions } = useContext(UserContext);
  const history = useHistory();

  const handleLogout = () => {
    logout();
    actions.updateAccessToken("");
    history.push("/user/login");
  };

  const { data, loading, error } = useMeQuery();
  let userLogged = false;
  if (error || loading) userLogged = false;
  if (data && data.me) userLogged = true;
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        {!userLogged ? (
          <>
            <li>
              <Link to="/user/register">Register</Link>
            </li>
            <li>
              <Link to="/user/login">Login</Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/me">Me</Link>
            </li>
            <li>
              <button className="logout-button" onClick={() => handleLogout()}>
                Logout
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
