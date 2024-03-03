import { User } from "lucia";
import { createContext } from "solid-js";
import type { Accessor } from "solid-js";

export const UserContext = createContext<Accessor<User | undefined>>();
