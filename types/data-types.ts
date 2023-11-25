export interface IProfile {
  _id: string;
  userId: string;
  name: string;
  imageUrl: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IServer {
  _id: string;
  name: string;
  imageUrl: string;
  inviteCode: string;
  profileId: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IChannel {
  _id: string;
  serverId: string[];
  name: string;
  type: string;
  profileId: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IMember {
  _id: string;
  serverId: string[];
  profileId: string[];
  role: string;
  createdAt: Date;
  updatedAt: Date;
}