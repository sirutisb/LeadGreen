import {useContext} from "react";
import { Route, Navigate } from "react-router-dom";
import AuthContext from "./AuthContext";

const PrivateRoute = ({ element: Element }) => {
    let {user} = useContext(AuthContext)
  return user ? (
    <Element />
  ) : (
    <Navigate to="/login" replace />
  );
};

export default PrivateRoute;
