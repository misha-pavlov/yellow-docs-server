import { Request } from 'express';

export type UserType = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  image: string;
  token: string;
};

export type SignUpReq = {
  body: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  };
};

export type SignInReq = {
  body: {
    email: string;
    password: string;
  };
};

export interface CurrentUserReq extends Request {
  user?: {
    user_id: string;
  };
}
