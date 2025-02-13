import { useContext } from "react";
import { AuthContext, IAuthContextData } from "./auth-context";

export const useAuth = (): IAuthContextData => useContext(AuthContext);
