// frontend/src/socket.js
//
// Ek hi socket connection poori app me reuse hota hai (singleton).
// Backend isi URL par socket.io bhi serve karta hai jis par
// normal REST API chalti hai (http://localhost:5000).

import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:5000";

const socket = io(SOCKET_URL, {
  autoConnect: true,
  transports: ["websocket", "polling"],
});

export default socket;