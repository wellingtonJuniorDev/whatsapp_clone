export interface IChatViewModel {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  date: string;
  time: string;
}

export interface IChatRequestViewModel {
  receiverId: string;
  message: string;
}

export interface ITypingUser {
  senderId : string;
  receiverId: string;
}
