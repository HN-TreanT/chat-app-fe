import * as React from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../../../context/appContext";
import RouterLinks from "../../../../const/router_link";

const VideoCall = () => {
  //   const roomID = getUrlParams().get("roomID") || randomID(5);
  const { socket } = React.useContext(AppContext);
  const navigate = useNavigate();
  const userCalling = useSelector((state) => state.videocall.userCalling);
  const roomID = useSelector((state) => state.videocall.roomId);
  const me = useSelector((state) => state.auth.userInfo);
  const handleLeaveRoom = () => {
    socket.emit("finish-call", {
      userCalling: userCalling._id,
    });
    navigate(RouterLinks.HOME_PAGE);
  };
  socket.off("finish-success").on("finish-success", (data) => {
    if (data === "success") {
      navigate(RouterLinks.HOME_PAGE);
      handleLeaveRoom();
    }
  });
  let myMeeting = async (element) => {
    // generate Kit Token
    const appID = 1594031934;
    const serverSecret = "dd390dc4502b5c6ce819b30aa111938a";
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      roomID,
      Date.now().toString(),
      me.displayName
    );

    // Create instance object from Kit Token.
    const zp = ZegoUIKitPrebuilt.create(kitToken);

    zp.joinRoom({
      container: element,
      sharedLinks: [
        {
          name: "Personal link",
          url:
            window.location.protocol +
            "//" +
            window.location.host +
            window.location.pathname +
            "?roomID=" +
            roomID,
        },
      ],
      scenario: {
        mode: ZegoUIKitPrebuilt.OneONoneCall, // To implement 1-on-1 calls, modify the parameter here to [ZegoUIKitPrebuilt.OneONoneCall].
      },
      onLeaveRoom: handleLeaveRoom,
    });
  };

  return (
    <div
      className="myCallContainer"
      ref={myMeeting}
      style={{ width: "100vw", height: "100vh" }}
    ></div>
  );
};

export default VideoCall;
