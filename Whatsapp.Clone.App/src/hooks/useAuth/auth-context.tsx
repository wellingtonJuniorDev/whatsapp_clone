import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ILoginReponse, IUser } from "../../interfaces/ILogin";

export interface IAuthContextData {
  user: IUser;
  isAuth: boolean;
  signIn: (login: ILoginReponse) => void;
  signOut: () => void;
}

export const AuthContext = createContext<IAuthContextData>(
  {} as IAuthContextData
);

export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<IUser>({} as IUser);

  useEffect(() => {
    if (user.id === undefined) {
      const storage = atob(localStorage.getItem("appToken") || "e30=");
      const login = JSON.parse(storage) as ILoginReponse;

      if (login.user) {
        setUser(login.user);
      }
    }
  }, [user]);

  const signIn = useCallback((login: ILoginReponse) => {
    localStorage.setItem("appToken", btoa(JSON.stringify(login)));
    setUser(login.user);
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem("appToken");
    setUser({} as IUser);
  }, []);

  return (
    <AuthContext.Provider
      value={useMemo(
        () => ({ user, isAuth: !!user.id, signIn, signOut }),
        [user, signIn, signOut]
      )}
    >
      {children}
    </AuthContext.Provider>
  );
};
