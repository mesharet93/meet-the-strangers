import * as store from "./store.js";
import * as ui from "./ui.js";
import * as webRTCHander from "./webRTCHandler.js";
import * as constants from "./constants.js";
import * as strangerUtils from "./strangerUtils.js";

let socketIO = null;

export const registerSocketEvents = (socket) => {
  socketIO = socket;
  socket.on("connect", () => {
    store.setSocketId(socket.id);
    ui.updatePersonalCode(socket.id);
  });

  socket.on("pre-offer", (data) => {
    webRTCHander.handlePreOffer(data);
  });
  socket.on("pre-offer-answer", (data) => {
    webRTCHander.handlePreOfferAnswer(data);
  });

  socket.on("user-hanged-up", () => {
    webRTCHander.handleConnectedUserHangedUp();
  });

  socket.on("webRTC-signaling", (data) => {
    switch (data.type) {
      case constants.webRTCSignaling.OFFER:
        webRTCHander.handleWebRTCOffer(data);
        break;
      case constants.webRTCSignaling.ANSWER:
        webRTCHander.handleWebRTCAnswer(data);
        break;
      case constants.webRTCSignaling.ICE_CANDIDATE:
        webRTCHander.handleWebRTCCandidate(data);
      default:
        return;
    }
  });
  socket.on("starnger-socket-id", (data) => {
    strangerUtils.connectWithStrangers(data);
  });
};

export const sendPreOffer = (data) => {
  socketIO.emit("pre-offer", data);
};

export const sendPreOfferAnswer = (data) => {
  socketIO.emit("pre-offer-answer", data);
};

export const sendDataUsingWebRTCSignaling = (data) => {
  socketIO.emit("webRTC-signaling", data);
};

export const sendUserHangedUp = (data) => {
  socketIO.emit("user-hanged-up", data);
};

export const changeStrangerConnectionStatus = (data) => {
  socketIO.emit("stranger-connection-status", data);
};

export const getStrangerSocketId = () => {
  socketIO.emit("get-stranger-socket-id");
};
