import { Server, Socket, ServerOptions } from "socket.io";
import https from "https";
import { ParseUserData } from "../Helpers/ParseUserData";
import { Encryptions } from "../Helpers/Encryptions";
import { getUser } from "../Helpers/DisadusAPIClient/UserAPIs";
import { fstatSync, lstatSync, readdirSync } from "fs";
import { SocketHandler } from "./SocketHandler";
import { readdir } from "fs/promises";
export type WebRequest = {
  url: string;
  method: string;
};
// export type WebResponder = (req: WebRequest, res: WebResponse) => void | Promise<void>;
export class SocketServer {
  socketServer: Server;
  sockets: Map<string, Socket> = new Map();
  socketIdentities: Map<string, string> = new Map();
  socketEvents: Map<string, SocketHandler> = new Map();
  ready: boolean = false;
  constructor(httpsServer?: https.Server | Express.Application) {
    const options = {
      cors: {
        origin: "*",
      },
    } as Partial<ServerOptions>;
    this.socketServer = httpsServer
      ? new Server(httpsServer, options)
      : new Server(httpsServer, options);
    this.socketServer.on(
      "connection",
      (async (socket: Socket) => {
        console.log("Socket Connection Request");
        const token = socket.handshake.auth.token.replace(/[^ ]+ /, "");
        if (token) {
          let user = null;
          user = (await Encryptions.decrypt(token).catch((_) => {})) as any;
          console.log(user, "decrypted");
          user = user && user.data && (user.data.userID as string);
          this.socketIdentities.set(socket.id, user);
          console.log("Socket Connection Request", user);
          socket.emit("identified", user);
          while (!this.ready) {
            await new Promise((r) => setTimeout(r, 50));
          }
          this.attachPathsToSocket(socket);
          this.sockets.set(socket.id, socket);
          socket.emit("ready");
        } else {
          socket.disconnect(true);
        }
      }).bind(this)
    );
    this.intializeSocketEvents();
    console.log("Socket Server Initialized");
  }
  async intializeSocketEvents() {
    const addPath = async (path: string) => {
      await Promise.all(
        (
          await readdir(path)
        ).map(async (file) => {
          if (lstatSync(`${path}/${file}`).isDirectory()) {
            return addPath(`${path}/${file}`);
          }
          if (!file.endsWith(".ts") && !file.endsWith(".js")) {
            return;
          }
          import(`${path}/${file}`).then((module) => {
            const handler = module.default as SocketHandler;
            if (!handler) {
              return console.log(`${file} is not a socket handler`);
            }
            this.socketEvents.set(handler.event, handler);
            console.log(`Socket Event ${handler.event} added`);
          });
        })
      );
    };
    await addPath(`${__dirname}/../SocketAPI/SocketPaths`);
    console.log("Socket Paths Initialized");
    this.ready = true;
  }
  attachPathsToSocket(socket: Socket) {
    socket.removeAllListeners();
    socket.on("disconnect", () => {
      this.sockets.delete(socket.id);
      this.socketIdentities.delete(socket.id);
    });
    this.socketEvents.forEach((handler) => {
      socket.on(handler.event, (...data) => {
        // console.log(
        //   `Socket Event ${handler.event} fired`,
        //   socket.id,
        //   this.socketIdentities.get(socket.id)
        // );
        handler.run(
          socket,
          () => this.socketIdentities.get(socket.id) || "",
          this.socketIdentities.get(socket.id),
          ...data
        );
      });
    });
  }
}
export default SocketServer;
