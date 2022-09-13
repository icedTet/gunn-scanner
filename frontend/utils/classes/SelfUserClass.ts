import EventEmitter from "events";
import { APIDomain } from "../constants";
import { fetcher } from "../fetcher";
import { UserType } from "../../../types/UserTypes";

export class SelfUserClass extends EventEmitter {
  static instance: SelfUserClass;
  static getInstance() {
    if (!this.instance) {
      this.instance = new SelfUserClass();
    }
    return this.instance;
  }
  user: UserType | undefined | null;

  private constructor() {
    super();
    localStorage.getItem("user") &&
      (this.user = JSON.parse(localStorage.getItem("user")!));
  }
  async fetchUser() {
    if (!localStorage.getItem("token")) return;
    fetcher(`${APIDomain}/user/@me`)
      .then((res) => (res.ok ? res.json() : null))
      .then((user) => {
        this.user = user;
        this.emit("userUpdate", user);
        localStorage.setItem("user", JSON.stringify(user));
      });
  }
}
