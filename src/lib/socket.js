import { io } from "socket.io-client";

export const socket = io("https://mr-wari-backend-production.up.railway.app", {
  autoConnect: true,
});
