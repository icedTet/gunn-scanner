import { Socket } from "socket.io";
export const validateSignupRequest = async (
  socket: Socket,
  username?: string,
  password?: string,
  email?: string,
  firstName?: string,
  lastName?: string,
  signupCode?: string
) => {
  if (!username || !password || !email || !firstName || !lastName) {
    socket.emit("signup", {
      success: false,
      message: "Missing fields",
    });
    return;
  }
  if (username.length < 3) {
    socket.emit("signup", {
      success: false,
      message: "Username must be at least 3 characters",
    });
    return;
  }
  if (username.length > 20) {
    socket.emit("signup", {
      success: false,
      message: "Username must be less than 20 characters",
    });
    return;
  }
  //Check if username is alpha numeric or underscore
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    socket.emit("signup", {
      success: false,
      message:
        "Username must only contain alpha-numeric or underscore characters ",
    });
    return;
  }
  if (password.length < 6) {
    socket.emit("signup", {
      success: false,
      message: "Password must be at least 6 characters",
    });
    return;
  }
  const UserDataDB = await MongoDB!.db("UserData");
  const RequireSignupCode = await MongoDB!
    .db("Settings")
    .collection("Settings")
    .findOne({
      key: "RequireSignupCode",
    });
  if (RequireSignupCode && RequireSignupCode.value) {
    if (!signupCode) {
      socket.emit("signup", {
        success: false,
        message:
          "Disadus is currently in Closed signup mode! Please contact Tet for an invite link at tet@tet.moe !",
      });
      return;
    }
    const ValidSignup = await UserDataDB.collection("signupCodes").findOne({
      code: signupCode,
    });
    if (!ValidSignup) {
      socket.emit("signup", {
        success: false,
        message: "Invalid signup code",
      });
      return;
    }
  }
};
