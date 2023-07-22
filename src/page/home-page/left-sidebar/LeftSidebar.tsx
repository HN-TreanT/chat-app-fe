import React, { useContext } from "react";
import Avatar from "antd/es/avatar/avatar";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import "./LeftSidebar.scss";
import RouterLinks from "../../../const/router_link";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../../context/appContext";

const LeftSidebar: React.FC<any> = ({ handleOpenDrawer }) => {
  const { setMessages } = useContext(AppContext);
  const navigate = useNavigate();
  const me = useSelector((state: any) => state.auth.userInfo);
  const handleLogout = () => {
    setMessages([]);
    localStorage.clear();
    window.location.reload();
    navigate(RouterLinks.LOGIN_PAGE);
  };
  return (
    <div className="left-sidebar">
      <div className="naviagtion"></div>
      <div className="info-user">
        <Avatar
          onClick={handleOpenDrawer}
          style={{
            backgroundColor: "rgba(148, 146, 146, 0.116)",
            border: "2px solid green",
            cursor: "pointer",
          }}
          src={me?.avatarImage}
          size={47}
        >
          {me?.displayName ? me?.displayName.charAt(0).toUpperCase() : "A"}{" "}
        </Avatar>
        <FontAwesomeIcon onClick={handleLogout} className="icon" icon={faArrowRightFromBracket} />
      </div>
    </div>
  );
};
export default LeftSidebar;
