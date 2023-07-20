import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
import RouterLinks from "../../const/router_link";
// import { useEffect } from "react";
import { useSelector } from "react-redux";
export const AuthorizationComponent = (props: any) => {
  //   const navigate = useNavigate();
  const isLogin = useSelector((state: any) => state.state.loginState);

  if (isLogin) {
    return props.element;
  } else {
    return <Navigate to={RouterLinks.LOGIN_PAGE} />;
  }
};
