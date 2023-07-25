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
  const span = useSelector((state: any) => state.state.span);
  const conversationORsidebar = useSelector((state: any) => state.state.conversationORsidebar);
  const me = useSelector((state: any) => state.auth.userInfo);
  const { socket, setMessages } = useContext(AppContext);
  const loading = useSelector((state: any) => state.state.loadingState);

  useEffect(() => {
    socket.io.opts.query = { username: me?.username };
    socket.disconnect();
    socket.connect();
  }, [me?.username, socket]);
  useEffect(() => {
    if (window.innerWidth > 768) {
      dispatch(
        actions.StateAction.setSpan({
          colSpan: 6,
          spanConversation: 17,
          spanLeftSidbar: 1,
        })
      );
    }
    if (
      window.innerWidth < 768 &&
      (conversationORsidebar === "sidebar" || !conversationORsidebar)
    ) {
      dispatch(actions.StateAction.setConversationOrSidebar("sidebar"));
      dispatch(
        actions.StateAction.setSpan({
          colSpan: 24,
          spanConversation: 0,
          spanLeftSidbar: 0,
        })
      );
    }
    if (window.innerWidth < 768 && conversationORsidebar === "conversation") {
      dispatch(
        actions.StateAction.setSpan({
          colSpan: 0,
          spanConversation: 24,
          spanLeftSidbar: 0,
        })
      );
    }
  }, [actions.StateAction, conversationORsidebar, dispatch]);
  const handleBackListFriend = () => {
    if (!loading) {
      // setColSpan(24);
      // setSpanConversation(0);
      dispatch(
        actions.StateAction.setSpan({
          colSpan: 24,
          spanConversation: 0,
          spanLeftSidbar: 0,
        })
      );
      dispatch(actions.StateAction.setConversationOrSidebar("sidebar"));
      dispatch(actions.AuthActions.setUserSelected({}));
    }
  };
  const handleDetailConversation = (e: any) => {
    if (window.innerWidth < 768) {
      dispatch(
        actions.StateAction.setSpan({
          colSpan: 0,
          spanConversation: 24,
          spanLeftSidbar: 0,
        })
      );
    }
    dispatch(actions.StateAction.setConversationOrSidebar("conversation"));
    socket.emit("start_conversation", {
      to: me._id,
      from: e._id,
    });
    setMessages([]);
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
        <Col span={span?.spanLeftSidbar}>
          <LeftSidebar handleOpenDrawer={handleOpenDrawer} />
        </Col>
        <Col span={span?.colSpan}>
          <Sidebar
            handleOpenDrawer={handleOpenDrawer}
            isMobile={window.innerWidth < 768}
            handleDetailConversation={handleDetailConversation}
            socket={socket}
          />
        </Col>

        <Col span={span?.spanConversation}>
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
