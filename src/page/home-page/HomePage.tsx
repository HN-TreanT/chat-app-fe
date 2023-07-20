import React, { useContext, useEffect, useState } from "react";
import { Row, Col } from "antd";
import Sidebar from "./sidebar/sidebar";
import ChatContainer from "./chat-container/ChatContainer";
import "./HomePage.scss";
import { useSelector, useDispatch } from "react-redux";
import useAction from "../../redux/useActions";
import { AppContext } from "../../context/appContext";
import LeftSidebar from "./left-sidebar/LeftSidebar";
import DrawerInfoUser from "../../components/drawerInfoUser/DrawerInfoUser";

const HomePage: React.FC = () => {
  const dispatch = useDispatch();
  const actions = useAction();
  const [visibleDrawer, setVisibleDrawer] = useState<any>(false);
  const [colSpan, setColSpan] = useState(window.innerWidth < 768 ? 24 : 6);
  const [spanConversation, setSpanConversation] = useState(17);
  const [spanLeftSidbar, setSpanLeftSideBar] = useState(window.innerWidth < 768 ? 0 : 1);
  const me = useSelector((state: any) => state.auth.userInfo);
  const { socket, setMessages } = useContext(AppContext);

  useEffect(() => {
    socket.io.opts.query = { username: me?.username };
    socket.disconnect();
    socket.connect();
  }, [me?.username, socket]);
  useEffect(() => {
    if (window.innerWidth < 768) {
      setColSpan(24);
      setSpanLeftSideBar(0);
      setSpanConversation(0);
    }
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setColSpan(24);
        setSpanLeftSideBar(0);
        setSpanConversation(0);
      } else {
        setSpanLeftSideBar(1);
        setColSpan(6);
        setSpanConversation(17);
      }
    };
    // Gọi hàm handleResize khi kích thước màn hình thay đổi
    window.addEventListener("resize", handleResize);
    // Xóa event listener khi component bị hủy
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const handleBackListFriend = () => {
    setColSpan(24);
    setSpanConversation(17);
    dispatch(actions.AuthActions.setUserSelected({}));
  };
  const handleDetailConversation = (e: any) => {
    if (window.innerWidth < 768) {
      setColSpan(0);
      setSpanConversation(24);
    }
    socket.emit("start_conversation", {
      to: me._id,
      from: e._id,
    });
    dispatch(actions.AuthActions.setUserSelected(e));
  };

  const handleOpenDrawer = () => {
    // dispatch(actions.AuthActions.loadUserInfo());
    setVisibleDrawer(true);
  };

  return (
    <div className="home-page">
      <DrawerInfoUser visible={visibleDrawer} setVisible={setVisibleDrawer} />
      <Row gutter={[0, 0]}>
        <Col span={spanLeftSidbar}>
          <LeftSidebar handleOpenDrawer={handleOpenDrawer} />
        </Col>
        <Col span={colSpan}>
          <Sidebar
            handleOpenDrawer={handleOpenDrawer}
            isMobile={window.innerWidth < 768}
            handleDetailConversation={handleDetailConversation}
            socket={socket}
          />
        </Col>

        <Col span={spanConversation}>
          <ChatContainer
            handleBackListFriend={handleBackListFriend}
            isMobile={window.innerWidth < 768}
            socket={socket}
          />
        </Col>
      </Row>
    </div>
  );
};
export default HomePage;
