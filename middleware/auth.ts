import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { UserType } from "../types/userTypes";
import { refreshJWT } from "../utils/refreshJwt";

interface Config {
  TOKEN_KEY: string;
}

// as unknown for fix type
const config = process.env as unknown as Config;

const verifyToken = (
  req: { user: UserType } & Request,
  res: Response,
  next: NextFunction
) => {
  let token: string | undefined =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }

  // refresh jwt if need
  token = refreshJWT(token);

  try {
    const decoded: JwtPayload = jwt.verify(
      token,
      config.TOKEN_KEY
    ) as JwtPayload;
    req.user = decoded as UserType;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};

module.exports = verifyToken;
