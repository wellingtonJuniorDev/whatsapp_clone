export interface ILoginRequest {
  email: string;
  password: string;
}

export interface IUser {
  id: string;
  email: string;
  name: string;
  accessToken: string;
}

export interface ILoginReponse {
  expiresIn: number;
  user: IUser;
}
