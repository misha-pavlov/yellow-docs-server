import { Request } from "express";

export interface UserReq extends Request {
  user?: {
    user_id: string;
  };
}
