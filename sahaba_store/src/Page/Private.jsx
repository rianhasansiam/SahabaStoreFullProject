import PropTypes from "prop-types";
import { Navigate, useLocation } from "react-router-dom";

import { useContext } from "react";
import { contextData } from "../Contex";
import Loading from "./Loading";

const Private = ({ children }) => {
  const { userData, setRedirectPath  } = useContext(contextData)
  const location = useLocation();



  setRedirectPath(location.pathname)

  if (userData) {
    return children;
  }

//   if (loading) {
//     return <Loading></Loading>
//   }


  return <Navigate to="/login" />;
};


export default Private;
