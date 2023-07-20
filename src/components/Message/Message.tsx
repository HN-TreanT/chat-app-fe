import React from "react";
import "./Message.scss";
import { Avatar } from "antd";
const Message: React.FC<any> = ({ userSelected, content, position, nextMessage }) => {
  return (
    <div className={`message ${position}`}>
      {position === "recieved" ? (
        <Avatar
          className="hidden-avartar"
          style={{
            backgroundColor: `${!nextMessage ? "rgba(148, 146, 146, 0.116)" : "transparent"}`,
            marginRight: "3px",
          }}
          src={!nextMessage ? userSelected?.avatarImage : null}
          size={35}
        >
          {userSelected.displayName && !nextMessage
            ? userSelected.displayName.charAt(0).toUpperCase()
            : ""}{" "}
        </Avatar>
      ) : (
        ""
      )}
      <div className={`content`}>{content}</div>
    </div>
  );
};

export default Message;
