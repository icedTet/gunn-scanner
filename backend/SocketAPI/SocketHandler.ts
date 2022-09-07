import { Socket } from "socket.io";
export interface SocketHandler {
  event: string;
  run: (socket: Socket, identity: () => string, ...data: any) => void;
}
