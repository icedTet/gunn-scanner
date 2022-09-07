import { fork } from "child_process";
import { join } from "path";
import { updateUser } from "../../Helpers/DisadusAPIClient/UserAPIs";
import TetLib from "../../Helpers/TetLib";
import { RESTHandler, RESTMethods } from "../../server";
import { performance } from "perf_hooks";
const forks = [
  fork(join(__dirname, "../../Helpers/UpdateUserCropper")),
  fork(join(__dirname, "../../Helpers/UpdateUserCropper")),
  fork(join(__dirname, "../../Helpers/UpdateUserCropper")),
  fork(join(__dirname, "../../Helpers/UpdateUserCropper")),
  fork(join(__dirname, "../../Helpers/UpdateUserCropper")),
];
export const updateUserPFP = {
  path: "/uploads/profilePicture/@me",
  method: RESTMethods.POST,
  sendUser: true,
  run: async (req, res, next, user) => {
    let start = performance.now();
    if (!user) {
      res.status(401).send("Unauthorized");
      return;
    }
    const { b64 } = req.body;
    if (!b64) {
      res.status(400).send("Missing file information");
      return;
    }

    let croppedpfpProcess = await forks[~~(Math.random() * forks.length)];
    console.log(
      `Forked process ${croppedpfpProcess.pid}`,
      performance.now() - start
    );
    let croppedPfp = await new Promise((resolve, reject) => {
      croppedpfpProcess.send(b64 || "");
      croppedpfpProcess.on("message", (message) => {
        resolve(message);
      });
    });
    console.log(
      `Cropped pfp in ${performance.now() - start}`,
      performance.now() - start
    );
    start = performance.now();
    if (!croppedPfp) {
      res.status(400).send({
        success: false,
        error: "Failed to crop pfp",
      });
      return;
    }
    const pfp = Buffer.from(croppedPfp as string, "base64");
    const bucket = storage.bucket("profiles.disadus.app");
    const currentPfp = user.pfp;
    if (
      currentPfp &&
      currentPfp.match(/https:\/\/profiles\.disadus\.app\/\w+/)
    ) {
      const file = bucket.file(currentPfp.substring(29));
      await file.delete();
    }
    console.log(
      `Deleted old pfp in ${performance.now() - start}`,
      performance.now() - start
    );
    start = performance.now();
    const filename = `${TetLib.genID(20)}.png`;
    const file = bucket.file(`${user.id}/${filename}`);
    await file.save(pfp);
    console.log(
      `Saved new pfp in ${performance.now() - start}`,
      performance.now() - start
    );
    start = performance.now();
    await updateUser(user.id, {
      $set: {
        pfp: `https://profiles.disadus.app/${user.id}/${filename}`,
      },
    });
    console.log(
      `Updated user in ${performance.now() - start}`,
      performance.now() - start
    );

    res.status(200).send({
      success: true,
    });
  },
} as RESTHandler;
export default updateUserPFP;
