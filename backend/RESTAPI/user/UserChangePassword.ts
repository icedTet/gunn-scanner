import { RESTHandler, RESTMethods } from "../../server";
import phas from "password-hash-and-salt";
import { updateUser } from "../../Helpers/DisadusAPIClient/UserAPIs";

export const UserChangePassword = {
  path: "/user/@me/update/password",
  method: RESTMethods.POST,
  sendUser: true,
  run: async (req, res, next, user) => {
    if (!user) {
      res.status(401).send("Unauthorized");
      return;
    }
    if (!req.body.oldPassword) {
      res.status(400).send("Old password is required");
      return;
    }
    if (!req.body.newPassword) {
      res.status(400).send("New password is required");
      return;
    }
    if (req.body.oldPassword === req.body.newPassword) {
      res.status(400).send("Old password should not equal new password");
      return;
    }
    const valid = await new Promise((res, rej) =>
      phas(req.body.oldPassword).verifyAgainst(user.password, (err, verified) =>
        res(verified)
      )
    );
    if (!valid) {
      res.status(403).send("Incorrect old password");
      return;
    }
    const newPassword = (await new Promise((res, rej) =>
      phas(req.body.newPassword).hash((err, hash) =>
        err ? rej(err) : res(hash)
      )
    ).catch(() => {})) as string;
    if (newPassword) {
      await updateUser(user.id, { $set: { password: newPassword } });
      res.status(200).send("Password changed");
      return;
    }
  },
} as RESTHandler;
export default UserChangePassword;
