import { useEffect, useState } from "react";
import { UserType } from "../../types/UserTypes";
import { SelfUserClass } from "./classes/SelfUserClass";

export const useCurrentUser = () => {
  const [user, setUser] = useState(undefined as null | undefined | UserType);
  useEffect(() => {
    const listener = (user: UserType | null) => {
      setUser(user);
    };
    SelfUserClass.getInstance().on("userUpdate", listener);
    return () => {
      SelfUserClass.getInstance().off("userUpdate", listener);
    };
  }, []);
};
