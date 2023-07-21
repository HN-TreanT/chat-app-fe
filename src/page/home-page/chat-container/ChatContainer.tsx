import React, { useContext, useEffect, useRef, useState } from "react";
import Message from "../../../components/Message/Message";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone, faVideo, faArrowLeft, faCancel } from "@fortawesome/free-solid-svg-icons";
import { Avatar, Badge, Spin, Image, Modal, message } from "antd";
import InputChat from "./InputChat/InputChat";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import useAction from "../../../redux/useActions";
import { AppContext } from "../../../context/appContext";
import * as uuid from "uuid";
import "./ChatContainer.scss";
import { messageService } from "../../../utils/services/messageService";
import imgHello from "../../../assets/wave.png";
import { useNavigate } from "react-router-dom";

const ChatContainer: React.FC<any> = ({ handleBackListFriend, isMobile }) => {
  const dispatch = useDispatch();
  const actions = useAction();
  const navigate = useNavigate();
  const { socket, messages, setMessages } = useContext(AppContext);
  const userInfo = useSelector((state: any) => state.auth.userInfo);
  const userSelected = useSelector((state: any) => state.auth.userSelected);
  const conversation = useSelector((state: any) => state.auth.conversation);
  const loading = useSelector((state: any) => state.state.loadingState);
  const roomId = useSelector((state: any) => state.videocall.roomId);
  const [loadingMessage, setLoadingMessage] = useState(false);

  const [isScrollTop, setIsScrolltop] = useState(false);
  const [isOpenModalAcceptCall, setIsOpenModalAcceptCall] = useState(false);
  const [infoUserCall, setInfoUserCall] = useState<any>();
  const [page, setPage] = useState(2);

  const messageEndRef = useRef<any>(null);

  socket.off("new_message").on("new_message", function (data: any) {
    setMessages([...messages, data.message]);
    setIsScrolltop(false);
    dispatch(actions.AuthActions.loadFriend());
    setPage(2);
  });

  useEffect(() => {
    if (!isScrollTop) {
      scrollToBottom();
    }
  }, [isScrollTop, messages]);

  useEffect(() => {
    async function getMessages() {
      try {
        if (!isScrollTop) {
          const data = await messageService.getMessages(conversation._id, 1, 40);

          setMessages(data?.data ? data.data : []);
        }
      } catch (e) {
        console.log(e);
      }
    }
    getMessages();
  }, [actions.StateAction, conversation._id, dispatch, isScrollTop, setMessages]);
  function scrollToBottom() {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  const handleScroll = async (e: any) => {
    if (e.target.scrollTop === 0) {
      try {
        // dispatch(actions.StateAction.loadingState(true));
        setLoadingMessage(true);
        const data = await messageService.getMessages(conversation._id, page, 40);
        // dispatch(actions.StateAction.loadingState(false));
        setLoadingMessage(false);
        setIsScrolltop(true);
        setMessages([...data.data, ...messages]);
        setPage(page + 1);
      } catch (e: any) {
        console.log(e);
      }
    }
  };

  socket.off("start_chat").on("start_chat", async (data: any) => {
    dispatch(actions.AuthActions.setConversation(data));
    dispatch(actions.StateAction.loadingState(true));
    const messages = await messageService.getMessages(data._id, 1, 40);
    dispatch(actions.StateAction.loadingState(false));
    setMessages(messages.data);
    setPage(2);
    scrollToBottom();
  });
  socket.off("hey").on("hey", (data: any) => {
    setInfoUserCall(data.caller);
    dispatch(actions.VideoCallActions.setUserCalling(data.caller));
    dispatch(actions.VideoCallActions.setRoomId(data.roomId));
    setIsOpenModalAcceptCall(true);
  });
  const handleRedirectVideoCall = () => {
    const id = uuid.v4();
    socket.emit("calling", {
      roomId: id,
      caller: userInfo._id,
      reciever: userSelected._id,
    });
    dispatch(actions.VideoCallActions.setUserCalling(userSelected));
    dispatch(actions.VideoCallActions.setRoomId(id));
    return navigate(`/video-call/${id}`);
  };

  const handleAcceptCall = () => {
    return navigate(`/video-call/${roomId}`);
  };

  return (
    <div className="chat-container">
      <Modal
        title="Có người gọi đến"
        open={isOpenModalAcceptCall}
        onCancel={() => setIsOpenModalAcceptCall(false)}
        footer={null}
        width={400}
      >
        <div className="content-modal-call-accept">
          <div className="modal-info-user-call">
            <Avatar
              style={{ backgroundColor: "rgba(0, 0, 0, 0.295)" }}
              src={infoUserCall?.avatarImage}
              size={40}
            >
              {infoUserCall?.displayName ? infoUserCall.displayName.charAt(0).toUpperCase() : "A"}{" "}
            </Avatar>
            <div style={{ fontSize: "1rem" }}>
              {infoUserCall?.displayName ? infoUserCall?.displayName : "Người gọi"}
            </div>
          </div>
          <div className="modal-icon-control-call">
            <FontAwesomeIcon className="icon-control-call icon-cancel " icon={faCancel} />
            <FontAwesomeIcon
              onClick={handleAcceptCall}
              className="icon-control-call icon-accept "
              icon={faPhone}
            />
          </div>
        </div>
      </Modal>
      <div className="header-chat">
        <div className="user-conversation">
          {isMobile ? (
            <div className="icon-arrow-back" onClick={handleBackListFriend}>
              <FontAwesomeIcon icon={faArrowLeft} />
            </div>
          ) : (
            ""
          )}
          <Badge className="badge">
            <Avatar
              style={{ backgroundColor: "rgba(148, 146, 146, 0.116)" }}
              src={userSelected?.avatarImage}
              size={35}
            >
              {userSelected.displayName ? userSelected.displayName.charAt(0).toUpperCase() : "A"}{" "}
            </Avatar>
            <span
              className={`status ${
                userSelected?.status === "Online" ? "status-online" : "status-offline"
              }`}
            />
          </Badge>
          <div className="text-status">
            <div style={{ fontSize: "0.7rem", fontWeight: 550 }}>{userSelected?.displayName}</div>
            <div
              style={{
                fontSize: "0.6rem",
                color: "white",
              }}
            >
              {" "}
              {userSelected?.status}
            </div>
          </div>
        </div>
        <div className="other-method-conversation">
          <FontAwesomeIcon icon={faPhone} className="icon-method-conversation" />

          <FontAwesomeIcon
            onClick={handleRedirectVideoCall}
            icon={faVideo}
            className="icon-method-conversation"
          />
        </div>
      </div>
      <div onScroll={handleScroll} className="chat-message">
        {loadingMessage ? (
          <Spin
            style={{
              position: "relative",
              top: "0",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
        ) : (
          ""
        )}
        {Array.isArray(messages) && messages.length > 0 ? (
          messages.map((message: any, index) => {
            let nextMessage = false;
            if (messages[index + 1]?.to !== userInfo?._id) {
              nextMessage = true;
            }
            if (messages[index + 1] === undefined) {
              nextMessage = false;
            }
            return (
              <Message
                userSelected={userSelected}
                key={uuid.v4()}
                content={`${message?.text}`}
                position={message?.to === userInfo?._id ? `sended` : `recieved`}
                nextMessage={nextMessage}
              />
            );
          })
        ) : messages.length <= 0 ? (
          <div className="empty-message">
            <Image className="icon-hello" src={imgHello} preview={false} />
            <h4 className="title-empty-chat">{`Hãy gửi lời chào đến ${userSelected?.displayName}`}</h4>
          </div>
        ) : (
          <Spin
            style={{
              position: "relative",
              top: "0",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
        )}
        {/* {loading ? <Spin /> : ""} */}

        <div ref={messageEndRef}></div>
      </div>
      <InputChat socket={socket} />
    </div>
  );
};

export default ChatContainer;
