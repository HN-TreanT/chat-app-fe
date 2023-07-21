import React, { useContext, useState } from "react";
import { Tooltip } from "antd";
import { faPaperPlane, faFaceSmile, faImage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSelector } from "react-redux";
import Picker from "emoji-picker-react";
import "./InputChat.scss";
import { AppContext } from "../../../../context/appContext";

const InputChat: React.FC<any> = () => {
  const { socket } = useContext(AppContext);
  const userInfo = useSelector((state: any) => state.auth.userInfo);
  const conversation = useSelector((state: any) => state.auth.conversation);
  const userSelected = useSelector((state: any) => state.auth.userSelected);
  const [message, setMessage] = useState<any>("");
  const [showEmojiInput, setShowEmojiInput] = useState(false);
  const handleChangeInput = (e: any) => {
    setMessage(e.target.value);
  };
  const handleSendMessage = () => {
    socket.emit("send_message", {
      conversation_id: conversation?._id,
      to: userInfo?._id,
      from: userSelected?._id,
      message: message,
      type: "Text",
    });
    setMessage("");
  };
  const handleEmojiClick = (event: any, emojiObject: any) => {
    let msg = message;
    msg += emojiObject.emoji;
    setMessage(msg);
  };
  const handleClickShowEmoji = () => {
    setShowEmojiInput(!showEmojiInput);
  };
  return (
    <div className="input-chat-container">
      <div className="input-chat">
        <Tooltip
          placement="top"
          title="Đính kèm file"
          overlayInnerStyle={{ fontSize: "0.7rem" }}
          style={{ fontSize: "0.5rem" }}
        >
          <FontAwesomeIcon className="icon" icon={faImage} />
        </Tooltip>
        <input
          onFocus={(e: any) => {
            e.preventDefault();
          }}
          onKeyDown={(e: any) => {
            if (e.key === "Enter") {
              handleSendMessage();
            }
          }}
          onChange={handleChangeInput}
          type="text"
          placeholder="Nhập nội dung"
          className="input"
          value={message}
        />
        <div className="emoji">
          <FontAwesomeIcon onClick={handleClickShowEmoji} className="icon" icon={faFaceSmile} />
        </div>

        <FontAwesomeIcon onClick={handleSendMessage} className="icon" icon={faPaperPlane} />
      </div>
      {showEmojiInput ? <Picker onEmojiClick={handleEmojiClick} /> : ""}
    </div>
  );
};

export default InputChat;
