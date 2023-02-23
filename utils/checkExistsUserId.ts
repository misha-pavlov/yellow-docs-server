import { Response } from "express";
import { UserReq } from "./../types/common.types";

export const checkExistsUserId = (req: UserReq, res: Response) => {
  const userId = req.user && req.user.user_id;

  if (!userId) {
    res.status(400).json({ message: "User id not found!" });
    return null;
  }

  return userId;
};
