import React, { useRef, useEffect, useContext, useState } from "react";
import { AppContext } from "../../../../context/appContext";
import { useSelector } from "react-redux";
import { Row, Col, Tooltip } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhone,
  faVideo,
  faVideoSlash,
  faMicrophone,
  faMicrophoneSlash,
} from "@fortawesome/free-solid-svg-icons";
import "./Room.scss";
import { useNavigate } from "react-router-dom";
import RouterLinks from "../../../../const/router_link";

const Room = () => {
  const navigate = useNavigate();
  const userCalling = useSelector((state) => state.videocall.userCalling);
  const [isCalling, setIsCalling] = useState(false);
  const [isOpenCamera, setIsOpenCamera] = useState(true);
  const [isOpenMic, setIsOpenMic] = useState(true);
  const [colSpan, setColSpan] = useState(12);
  const roomId = useSelector((state) => state.videocall.roomId);
  const { socket } = useContext(AppContext);
  const userVideo = useRef();
  const partnerVideo = useRef();
  const peerRef = useRef();
  const otherUser = useRef();
  const userStream = useRef();

  useEffect(() => {
    if (window.innerWidth < 768) {
      setColSpan(24);
    }
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setColSpan(24);
      } else {
        setColSpan(12);
      }
    };
    window.addEventListener("resize", handleResize);
    // Xóa event listener khi component bị hủy
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then((stream) => {
      userVideo.current.srcObject = stream;
      userStream.current = stream;

      socket.emit("join room", roomId);

      // socket.on("other user", (userID) => {
      //   callUser(userID);
      //   otherUser.current = userID;
      // });

      // socket.on("user joined", (userID) => {
      //   otherUser.current = userID;
      // });

      // socket.on("offer", handleRecieveCall);

      // socket.on("answer", handleAnswer);

      // socket.on("ice-candidate", handleNewICECandidateMsg);
    });
  }, [roomId, socket]);

  socket.off("other user").on("other user", (userID) => {
    callUser(userID);
    otherUser.current = userID;
  });

  socket.off("user joined").on("user joined", (userID) => {
    otherUser.current = userID;
  });

  socket.off("offer").on("offer", handleRecieveCall);

  socket.off("answer").on("answer", handleAnswer);

  socket.off("ice-candidate").on("ice-candidate", handleNewICECandidateMsg);

  function callUser(userID) {
    ////
    setIsCalling(true);
    ////
    peerRef.current = createPeer(userID);
    userStream.current
      .getTracks()
      .forEach((track) => peerRef.current.addTrack(track, userStream.current));
  }

  function createPeer(userID) {
    const peer = new RTCPeerConnection({
      iceServers: [
        {
          urls: "stun:stun.stunprotocol.org",
        },
        {
          urls: "turn:numb.viagenie.ca",
          credential: "muazkh",
          username: "webrtc@live.com",
        },
      ],
    });

    peer.onicecandidate = handleICECandidateEvent;
    peer.ontrack = handleTrackEvent;
    peer.onnegotiationneeded = () => handleNegotiationNeededEvent(userID);

    return peer;
  }

  function handleNegotiationNeededEvent(userID) {
    peerRef.current
      .createOffer()
      .then((offer) => {
        return peerRef.current.setLocalDescription(offer);
      })
      .then(() => {
        const payload = {
          target: userID,
          caller: socket.id,
          sdp: peerRef.current.localDescription,
        };
        socket.emit("offer", payload);
      })
      .catch((e) => console.log(e));
  }

  function handleRecieveCall(incoming) {
    ////
    if (isCalling) {
      return;
    }
    ////
    peerRef.current = createPeer();
    const desc = new RTCSessionDescription(incoming.sdp);
    peerRef.current
      .setRemoteDescription(desc)
      .then(() => {
        userStream.current
          .getTracks()
          .forEach((track) => peerRef.current.addTrack(track, userStream.current));
      })
      .then(() => {
        return peerRef.current.createAnswer();
      })
      .then((answer) => {
        return peerRef.current.setLocalDescription(answer);
      })
      .then(() => {
        const payload = {
          target: incoming.caller,
          caller: socket.id,
          sdp: peerRef.current.localDescription,
        };
        socket.emit("answer", payload);
      });
  }

  function handleAnswer(message) {
    const desc = new RTCSessionDescription(message.sdp);
    peerRef.current.setRemoteDescription(desc).catch((e) => console.log(e));
  }

  function handleICECandidateEvent(e) {
    /////
    if (isCalling) {
      return;
    }

    ////
    if (e.candidate) {
      const payload = {
        target: otherUser.current,
        candidate: e.candidate,
      };
      socket.emit("ice-candidate", payload);
    }
  }

  function handleNewICECandidateMsg(incoming) {
    const candidate = new RTCIceCandidate(incoming);

    peerRef.current.addIceCandidate(candidate).catch((e) => console.log(e));
  }

  function handleTrackEvent(e) {
    partnerVideo.current.srcObject = e.streams[0];
  }

  const handleCameraSlash = () => {
    // if (isOpenCamera) {
    //   if (userStream.current) {
    //     userStream.current.getTracks().forEach((track) => track.stop());
    //   }
    // } else {
    //   if (userStream.current) {
    //     // userStream.current
    //     //   .getTracks()
    //     //   .forEach((track) => peerRef.current.addTrack(track, userStream.current));
    //   }
    // }
    setIsOpenCamera(!isOpenCamera);
  };
  const handleMicSlash = () => {
    setIsOpenMic(!isOpenMic);
  };
  // function remove camera
  const stopMedia = () => {
    if (userStream.current) {
      const videoTracks = userStream.current.getVideoTracks();
      videoTracks.forEach((track) => {
        track.stop(); // Dừng track camera
        userStream.current.removeTrack(track);
      });
    }
  };
  const handleFinishCall = () => {
    navigate(RouterLinks.HOME_PAGE);
    socket.emit("finish-call", {
      userCalling: userCalling._id,
    });
    stopMedia();
  };
  socket.off("finish-success").on("finish-success", (data) => {
    if (data === "success") {
      navigate(RouterLinks.HOME_PAGE);
      stopMedia();
    }
  });
  return (
    <div className="video-call">
      <div className="container">
        <div className="content">
          <Row gutter={[10, 10]}>
            <Col span={colSpan}>
              <div className="user-video">
                <video autoPlay={isOpenCamera} ref={userVideo} />
              </div>
            </Col>
            <Col span={colSpan}>
              <div className="partner-video">
                <video autoPlay ref={partnerVideo} />
              </div>
            </Col>
          </Row>
          <Col span={24}>
            <div className="button-control">
              <Tooltip title={`${isOpenCamera ? "Tắt camera" : "Bật camera"}`}>
                <FontAwesomeIcon
                  onClick={handleCameraSlash}
                  className={`icon-control ${isOpenCamera ? "camera" : ""}`}
                  icon={isOpenCamera ? faVideo : faVideoSlash}
                />
              </Tooltip>
              <Tooltip title={`${isOpenMic ? "Bật mic" : "Tắt mic"}`}>
                <FontAwesomeIcon
                  onClick={handleMicSlash}
                  className={`icon-control ${isOpenMic ? "mic" : ""}`}
                  icon={isOpenMic ? faMicrophone : faMicrophoneSlash}
                />
              </Tooltip>
              <Tooltip title="Kết thúc cuộc gọi">
                <FontAwesomeIcon
                  onClick={handleFinishCall}
                  className="icon-control"
                  style={{ backgroundColor: "red", color: "white" }}
                  icon={faPhone}
                />
              </Tooltip>
            </div>
          </Col>
        </div>
      </div>
    </div>
  );
};

export default Room;
