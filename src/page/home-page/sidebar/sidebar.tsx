import React, { useEffect, useState, useContext, useRef } from "react";
import { Input, Avatar, Row, Col, Tooltip, Modal, Button, Spin, Skeleton } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faUserPlus,
  faPlus,
  faArrowRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import ItemFriend from "../../../components/ItemFriend/ItemFriend";
import { authServices } from "../../../utils/services/authService";
import { useDispatch, useSelector } from "react-redux";
import useAction from "../../../redux/useActions";
import "./sidebar.scss";
import { AppContext } from "../../../context/appContext";
import RouterLinks from "../../../const/router_link";
import { useNavigate } from "react-router-dom";
import useDebounce from "../../../hooks/useDebounce";

const Sidebar: React.FC<any> = ({ handleDetailConversation, isMobile, handleOpenDrawer }) => {
  const { socket, setMessages } = useContext(AppContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const actions = useAction();
  // const loadingFriend = useSelector((state: any) => state.state.loadingFriend);
  // const socket = useRef<any>();
  const me = useSelector((state: any) => state.auth.userInfo);
  const friends = useSelector((state: any) => state.auth.listFriend);
  const valueSearchFriend = useSelector((state: any) => state.auth.valueSearchFriend);

  const [page, setPage] = useState(2);
  // const [listfriend, setListFriend] = useState(friends);
  const [loadingFriend, setLoadingFriend] = useState(false);
  const [isOpenModelAddUser, setIsOpenModelAddUser] = useState(false);
  const [isOpenModelMail, setIsOpenModelMail] = useState(false);
  const [isOpenModelCreateGroup, setIsOpenModelCreateGroup] = useState(false);
  const [valueSearchEmail, setValueSearchEamil] = useState("");
  const [userWantFriendLy, setUserWantFriendly] = useState<any>();
  const [sender, setSender] = useState<any>();
  const [searchValue, setSearchValue] = useState<any>("");
  const searchValueDebounce = useDebounce<string>(searchValue, 500);
  useEffect(() => {
    dispatch(actions.AuthActions.setValueSearchFriend(searchValueDebounce));
    dispatch(actions.AuthActions.loadFriend());
    setPage(2);
  }, [dispatch, actions.AuthActions, searchValueDebounce]);
  const handleChangeInputSearchEmail = (e: any) => {
    setValueSearchEamil(e.target.value);
  };
  //handle send request
  const handleSendRequestFriend = async () => {
    socket.emit("send_friendly_request", {
      sender: me._id,
      recipient: userWantFriendLy._id,
    });
  };
  // handle recieived friendly request
  socket.off("received_friendly_request").on("received_friendly_request", (data: any) => {
    if (data) {
      setIsOpenModelMail(true);
      setSender(data?.user);
    }
  });
  socket.off("online").on("online", (data: any) => {
    if (data.status === "online") dispatch(actions.AuthActions.loadFriend());
  });
  socket.off("offline").on("offline", (data: any) => {
    if (data.status === "offline") dispatch(actions.AuthActions.loadFriend());
  });
  socket.off("accept_success").on("accept_success", (data: any) => {
    if (data === "success") {
      dispatch(actions.AuthActions.loadFriend());
    }
  });
  const handleClickSearch = async () => {
    try {
      dispatch(actions.StateAction.loadingState(true));
      const user = await authServices.getByEmail(valueSearchEmail);
      if (user.status) {
        setUserWantFriendly(user.data);
      } else {
        setUserWantFriendly(null);
      }
      dispatch(actions.StateAction.loadingState(false));
    } catch (err: any) {
      console.log(err);
    }
  };
  //handle accept request
  const handleAcceptRequest = () => {
    socket.emit("accept_friendly_request", {
      sender: sender?._id,
      recipient: me?._id,
    });
    setIsOpenModelMail(false);
  };
  const handleSearchValue = (e: any) => {
    setSearchValue(e.target.value);
  };
  //handle scroll
  const handleScroll = async (e: any) => {
    if (e.target.scrollHeight - e.target.scrollTop < e.target.clientHeight + 1) {
      try {
        // dispatch(actions.StateAction.setLoadingFriend(true));
        setLoadingFriend(true);
        let data = await authServices.getFriends(me._id, page, 15, valueSearchFriend);
        // setListFriend([...listfriend, ...data.data]);
        // dispatch(actions.StateAction.setLoadingFriend(false));
        setLoadingFriend(false);
        dispatch(actions.AuthActions.loadFriendSuccess([...friends, ...data.data]));
        setPage(page + 1);
      } catch (e: any) {
        console.log(e);
      }
    }
  };
  return (
    <div className="sider-bar">
      <Modal
        title={`Nhập tên của nhóm`}
        footer={true}
        onCancel={() => setIsOpenModelCreateGroup(false)}
        open={isOpenModelCreateGroup}
      >
        <Input placeholder="Nhập tên của nhóm"></Input>
      </Modal>
      <Modal
        title={`Kết bạn`}
        footer={null}
        onCancel={() => {
          setIsOpenModelAddUser(false);
          setValueSearchEamil("");
          setUserWantFriendly(null);
        }}
        open={isOpenModelAddUser}
        width={300}
      >
        <div className="modal-add-user">
          <Input
            placeholder="Nhập email để tìm kiếm"
            value={valueSearchEmail}
            prefix={
              <FontAwesomeIcon
                onClick={handleClickSearch}
                className="icon-search"
                style={{
                  cursor: "pointer",
                  color: "rgba(0, 0, 0, 0.664)",
                }}
                icon={faMagnifyingGlass}
              />
            }
            onChange={handleChangeInputSearchEmail}
          ></Input>
          <div className="user-search">
            {/* <Spin /> */}
            {loadingFriend ? (
              <Spin size="small" />
            ) : (
              <>
                {userWantFriendLy ? (
                  <>
                    <div>
                      <Avatar src={userWantFriendLy?.avatarImage} size={33}>
                        {userWantFriendLy?.displayName
                          ? userWantFriendLy?.displayName.charAt(0).toUpperCase()
                          : "A"}{" "}
                      </Avatar>
                      <span style={{ fontSize: "0.8rem", fontWeight: 550 }}>
                        {" "}
                        {userWantFriendLy?.displayName}
                      </span>
                    </div>
                    <Button onClick={handleSendRequestFriend} size="small" type="primary">
                      Kết bạn
                    </Button>
                  </>
                ) : (
                  ""
                )}
              </>
            )}
          </div>
        </div>
      </Modal>

      <Modal
        open={isOpenModelMail}
        title="Lời mời kết bạn"
        onCancel={() => setIsOpenModelMail(false)}
        footer={[
          <Button
            key="back"
            onClick={() => {
              setIsOpenModelMail(false);
            }}
            danger
          >
            Hủy
          </Button>,
          <Button type="primary" onClick={handleAcceptRequest}>
            Đồng ý
          </Button>,
        ]}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <Avatar src={sender?.avatarImage} size={33}>
            {sender?.displayName ? sender?.displayName.charAt(0).toUpperCase() : "A"}{" "}
          </Avatar>
          <div style={{ paddingLeft: "5px" }}>
            <div style={{ fontSize: "0.8rem", fontWeight: 550 }}> {sender?.displayName}</div>
            <div style={{ fontSize: "0.7rem", fontWeight: 550 }}>{sender?.email}</div>
          </div>
        </div>
      </Modal>

      <div className="header-sider-bar">
        <Row gutter={[10, 10]}>
          <Col span={24}>
            <div className="info-me">
              <div className="title">Chat</div>
              <div className="other-function">
                <Button onClick={() => setIsOpenModelCreateGroup(true)} size="small" type="primary">
                  <FontAwesomeIcon icon={faPlus} style={{ paddingRight: "5px" }} />
                  Tạo nhóm
                </Button>
                <Tooltip
                  placement="top"
                  title="Thêm bạn bè"
                  overlayInnerStyle={{ fontSize: "0.7rem" }}
                  style={{ fontSize: "0.5rem" }}
                >
                  {" "}
                  <FontAwesomeIcon
                    onClick={() => setIsOpenModelAddUser(true)}
                    icon={faUserPlus}
                    className="icon-footer-sidebar"
                  />
                </Tooltip>
              </div>
            </div>
            <Input
              value={searchValue}
              placeholder="Tìm kiếm bạn bè"
              prefix={<FontAwesomeIcon className="icon-search" icon={faMagnifyingGlass} />}
              className="input-search"
              onChange={handleSearchValue}
            ></Input>
          </Col>
          <Col span={24}></Col>
        </Row>
      </div>
      <div onScroll={handleScroll} className="list-friend">
        <div>
          {Array.isArray(friends)
            ? friends.map((friend: any) => {
                return (
                  <ItemFriend
                    key={friend?._id}
                    friend={friend}
                    handleDetailConversation={handleDetailConversation}
                  />
                );
              })
            : ""}
        </div>

        {loadingFriend ? <Spin /> : ""}
      </div>
      {isMobile ? (
        <div className="container-footer-sidebar">
          <div className="footer-sidebar">
            <div>
              <Avatar
                onClick={handleOpenDrawer}
                style={{ backgroundColor: "rgba(148, 146, 146, 0.116)" }}
                src={me?.avatarImage}
                size={33}
              >
                {me?.displayName ? me?.displayName.charAt(0).toUpperCase() : "A"}{" "}
              </Avatar>
              <span
                style={{ fontSize: "0.6rem", fontWeight: 550, marginLeft: "7px", color: "white" }}
              >
                {me?.displayName}
              </span>
            </div>
            <div className="icon-logout">
              <FontAwesomeIcon
                onClick={() => {
                  localStorage.clear();
                  setMessages([]);
                  // dispatch(actions.AuthActions.setUserSelected({}));
                  // dispatch(actions.AuthActions.set)
                  navigate(RouterLinks.LOGIN_PAGE);
                }}
                style={{ fontSize: "1rem", color: "rgba(255, 255, 255, 0.596)" }}
                icon={faArrowRightFromBracket}
              />
            </div>
          </div>
        </div>
      ) : (
        <div style={{ marginBottom: "3px" }}></div>
      )}
    </div>
  );
};

export default Sidebar;
