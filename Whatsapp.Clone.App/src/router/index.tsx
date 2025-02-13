import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { SignIn } from "../pages/sign-in";
import { SignUp } from "../pages/sign-up";
import { Chat } from "../pages/chat";
import { useAuth } from "../hooks/useAuth";
import { Messages } from "../components/messages";
import { Profile } from "../components/profile";
import { createSignalRContext } from "react-signalr";

export const SignalRContext = createSignalRContext();

export const AppRouter = () => {
  const { isAuth, user } = useAuth();

  const anonymousRoutes = (
    <>
      <Route index element={<SignIn />} />
      <Route path="sign-in" element={<SignIn />} />
      <Route path="sign-up" element={<SignUp />} />
    </>
  );

  const authRoutes = (
    <>
      <Route path="/" element={<Chat />}>
        <Route index element={<Profile />} />
        <Route path="profile" element={<Profile />} />
        <Route path="chat/:userId" element={<Messages />} />
      </Route>
    </>
  );

  return (
    <BrowserRouter>
      <SignalRContext.Provider
        connectEnabled={isAuth}
        accessTokenFactory={() => user.accessToken}
        dependencies={[user.accessToken]}
        url={`${import.meta.env.VITE_API}${import.meta.env.VITE_CHATHUB}`}
      >
        <Routes>
          {isAuth ? authRoutes : anonymousRoutes}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </SignalRContext.Provider>
    </BrowserRouter>
  );
};
