import EventEmitter from "events";
import { APIDomain } from "../constants";
import { fetcher } from "../fetcher";
import { UserType } from "../types/UserTypes";

export class SelfUserClass extends EventEmitter {
  static instance: SelfUserClass;
  static getInstance() {
    if (!this.instance) {
      this.instance = new SelfUserClass();
    }
  }
  user: undefined as UserType | undefined;
  
  private constructor() {
    super();

  }
  async fetchUser(){
    if (!)
    fetcher(`${APIDomain}/user/@me`)

  }
}
