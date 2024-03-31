import { User } from "lucia";
import { createContext } from "solid-js";
import type { Resource } from "solid-js";

export const UserContext = createContext<Resource<User>>();
