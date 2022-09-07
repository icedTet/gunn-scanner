import express, { NextFunction, Request, Response } from "express";
const server = express();
import https from "https";
import cors from "cors";
import { MongoClient } from "mongodb";
import nodemailer from "nodemailer";
import { env } from "./env";
import { UserCleaners } from "./Helpers/Cleaners/UserCleaners";
import { ParseUserData } from "./Helpers/ParseUserData";
import SocketServer from "./SocketAPI/SocketServer";
import { readFileSync } from "fs";
import { lstat, readdir } from "fs/promises";
import { DisadusUser } from "./Helpers/Types/RawDisadusTypes";
import { Storage } from "@google-cloud/storage";
import { UserTokenTypes } from "./Helpers/Encryptions";
import { PluginIntent } from "./RESTAPI/plugins/PluginOAuth";
import { getCourse } from "./Helpers/DisadusAPIClient/CommunityCourseAPIs";
declare global {
  var MongoDB: MongoClient | null;
  var MailTransporter: nodemailer.Transporter | null;
  var storage: Storage;

  var Cleaners: { UserCleaners: UserCleaners };
}
export interface RESTHandler {
  path: string;
  method: RESTMethods;
  sendUser: boolean;
  intent?: PluginIntent;
  run: (
    req: Request,
    res: Response,
    next: NextFunction,
    user?: DisadusUser
  ) => void | Promise<void> | any | Promise<any>;
}
export enum RESTMethods {
  GET = "get",
  POST = "post",
  PUT = "put",
  DELETE = "delete",
}
globalThis.MongoDB = null;
globalThis.MailTransporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: env.nodeMailer.email,
    pass: env.nodeMailer.password,
  },
});
globalThis.Cleaners = {
  UserCleaners: UserCleaners,
};
process.env = Object.assign(process.env, env);
globalThis.storage = new Storage({
  credentials: env.google,
  keyFilename: "./keys/disadus-gcpKey.json",
});

/** @type {import('./Helpers/Databases')} */
const MongoConnection = new MongoClient(env.mongo, {});
console.log("Establishing Mongo Connection...");
const importAllHandlers = async (path: string, failedImports: string[]) => {
  await Promise.all(
    (
      await readdir(path)
    ).map(async (file) => {
      console.log(`Importing ${file}`);
      if ((await lstat(`${path}/${file}`)).isDirectory()) {
        console.log(`Importing Folder ${path}/${file}`);
        return await importAllHandlers(`${path}/${file}`, failedImports);
      }
      if (!file.endsWith(".ts") && !file.endsWith(".js")) {
        return;
      }
      import(`${path}/${file}`)
        .then((module) => {
          console.log(`${file} imported`);
          const handler = module.default as RESTHandler;
          if (!handler) {
            return failedImports.push(`${file} is not a REST handler`);
          }
          console.log(handler);
          server[handler.method](handler.path, async (req, res, next) => {
            let userInfo = handler.sendUser ? await ParseUserData(req) : null;
            if (userInfo?.tokenType === UserTokenTypes.PLUGIN) {
              if (!handler.intent)
                return res
                  .sendStatus(403)
                  .send("Endpoint does not support Plugin Generated Tokens");
              if (!userInfo.intents)
                return res
                  .sendStatus(403)
                  .send("Plugin Token does not have any intents");
              if (!userInfo.intents.includes(handler.intent)) {
                return res
                  .sendStatus(403)
                  .send(
                    "Plugin Token does not have permission to use this endpoint"
                  );
              }
            }
            handler.run(
              req as Request,
              res as Response,
              next,
              userInfo?.user || undefined
            );
          });
          console.log(`Loaded ${file}`);
        })
        .catch((err) => {
          console.error(`Failed to import ${file}`);
          console.error(err);
          failedImports.push(`${file} failed to import`);
        });
    })
  );
};

MongoConnection.connect().then((db) => {
  console.log("Established Mongo Connection...");
  globalThis.MongoDB = db;
  server.use(
    cors({
      exposedHeaders: ["filename", "updatedat"],
      maxAge: 1209600,
    })
  );
  // (async () => {
  //   const things = await db
  //     .db("Plugins")
  //     .collection("scheduleCommunityPreferences")
  //     .find({})
  //     .toArray();
  //   await db.db("Communities").collection("masterSchedule").deleteMany({});
  //   console.log(things);
  //   const a = {
  //     community: "tet",
  //     periods: {
  //       p0: "Period 0",
  //     },
  //     scheduleType: "weekly",
  //     scheduleDays: {
  //       monday: [{ period: "p0", starts: "7:55AM", ends: "8:50AM" }],
  //       tuesday: [{ period: "p0", starts: "7:55AM", ends: "8:50AM" }],
  //       wednesday: [{ period: "p0", starts: "7:55AM", ends: "8:50AM" }],
  //     },
  //     timezone: "America/Los_Angeles",
  //   };
  //   for (let thing of things) {
  //     const parsePeriodList = (
  //       periodlist: { period: string; starts: string; ends: string }[]
  //     ) => {
  //       let periods = [];
  //       if (!periodlist) return [];
  //       const TimeToMillisecondsPastMidnight = (time: string) => {
  //         const amOrPM = time.includes("AM") ? "AM" : "PM";
  //         const [hour, minute] = time.replace(/[A-Z]+/g, "").split(":");
  //         return (
  //           Number(hour) * 60 * 60 * 1000 +
  //           Number(minute) * 60 * 1000 +
  //           (amOrPM === "AM" || hour === "12" ? 0 : 12 * 60 * 60 * 1000)
  //         );
  //       };
  //       console.log(periodlist);
  //       for (let period of periodlist) {
  //         periods.push({
  //           period: period.period,
  //           from: TimeToMillisecondsPastMidnight(period.starts),
  //           to: TimeToMillisecondsPastMidnight(period.ends),
  //         });
  //       }
  //       return periods;
  //     };

  //     const newThing = {
  //       community: thing.community,
  //       timezone: thing.timezone,
  //       periods: thing.periods,
  //       schedule: {
  //         monday: parsePeriodList(thing.scheduleDays.monday),
  //         tuesday: parsePeriodList(thing.scheduleDays.tuesday),
  //         wednesday: parsePeriodList(thing.scheduleDays.wednesday),
  //         thursday: parsePeriodList(thing.scheduleDays.thursday),
  //         friday: parsePeriodList(thing.scheduleDays.friday),
  //         saturday: parsePeriodList(thing.scheduleDays.saturday),
  //         sunday: parsePeriodList(thing.scheduleDays.sunday),
  //         scheduleType: "weekly",
  //       },
  //       icals: [],
  //     };
  //     await db
  //       .db("Communities")
  //       .collection("masterSchedule")
  //       .insertOne(newThing);
  //   }
  // })();

  server.use(express.json({ limit: "100mb" }));
  const failedImports = [] as string[];
  importAllHandlers(`${__dirname}/RESTAPI`, failedImports).then(() => {
    console.log("Loaded all handlers");
    console.log(
      `${failedImports.length} handlers failed to load`,
      failedImports
    );
  });
  //Import all REST Endpoints

  if (env?.webserver) {
    const httpsServer = https.createServer(
      {
        //@ts-ignore
        key: readFileSync(env.webserver?.keyPath),
        //@ts-ignore
        cert: readFileSync(env.webserver?.certPath),
      },
      server
    );
    new SocketServer(
      httpsServer.listen(env.port, () => {
        console.log(`Secure HTTP Server started on port ${env.port}`);
      })
    );
  } else {
    console.log(`HTTP Server running on port ${env.port}`);
    const SocketAPI = new SocketServer(server.listen(env.port));
  }
});
process.on("unhandledRejection", (reason, p) => {
  console.trace("Unhandled Rejection at: Promise", p, "reason:", reason);
  // application specific logging, throwing an error, or other logic here
});
// (async ()=>{

//   let msg = await MailTransporter.sendMail({
//     from: '\'Tet from Disadus\' no-reply@disadus.app',
//     to: 'ic3dplasma@gmail.com',
//     subject: '[Disadus] (694200) Verify your email!',
//     text: 'Your security code is 694200. It expires in 15 minutes.',
//   });
//   console.log('Msg sent!');

// })();
