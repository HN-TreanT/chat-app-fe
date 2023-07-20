import { io } from "socket.io-client";
import React from "react";
import { serverConfig } from "../const";
// export let socket = io(serverConfig.server, {
//   query: {
//     username: "heelo",
//   },
// });
export let socket = io(serverConfig.server);
// app context
export const AppContext = React.createContext();
