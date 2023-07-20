import React from "react";
import "./ItemFriend.scss";
import { ChatCard } from "react-chat-engine-advanced";
import { useSelector } from "react-redux";

const ItemFriend: React.FC<any> = ({ friend, handleDetailConversation }) => {
  const userSeletecd = useSelector((state: any) => state.auth.userSelected);
  return (
    <div className="item-friend">
      <ChatCard
        // style={{ border: "1px solid blue !important" }}
        className="chat-card"
        onClick={() => handleDetailConversation(friend)}
        title={`${friend?.displayName}`}
        description={"Say hello!"}
        avatarUrl={friend?.avatar}
        avatarUsername={friend?.username}
        avatarStyle={{
          boxShadow:
            friend?.status === "Online"
              ? "rgb(24 144 255 / 35%) 0px 2px 7px"
              : "rgb(245 34 45 / 35%) 0px 2px 7px",
          border: friend?.status === "Online" ? "2px solid green" : "1px solid red",
        }}
        isActive={userSeletecd._id === friend._id}
        // onClick={() => props.chat && props.onChatCardClick(props.chat.id)}
      />
    </div>
  );
};
export default ItemFriend;
