import express, { Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { CATS_MEMES_IMAGE_URLS } from "../static/images";
import {
  SearchByEmail,
  SignInReq,
  SignUpReq,
  UserByIdReq,
  UserType,
} from "../types/user.types";
import { UserReq } from "../types/common.types";
import { checkExistsUserId } from "../utils/checkExistsUserId";

const UserModel = require("../models/userModel/userModel");
const auth = require("../middleware/auth");
const userRouter = express.Router();

// POST
userRouter.post("/signup", async (req: SignUpReq, res: Response) => {
  const isExistingUser = await UserModel.findOne({ email: req.body.email });

  if (isExistingUser) {
    res.status(400).json({ message: "User already exists!" });
    return null;
  }

  const randomNumber = Math.floor(Math.random() * 10);
  const image = CATS_MEMES_IMAGE_URLS[randomNumber];
  // encrypt user password
  const encryptedPassword = await bcrypt.hash(req.body.password, 10);

  const user = new UserModel({
    image,
    email: req.body.email,
    lastName: req.body.lastName,
    firstName: req.body.firstName,
    password: encryptedPassword,
  });

  // Create token
  const token = jwt.sign(
    { user_id: user._id, email: req.body.email },
    process.env.TOKEN_KEY as string,
    {
      expiresIn: "2h",
    }
  );

  // save user token
  user.token = token;

  try {
    const userToSave = await user.save();
    res.status(201).json(userToSave);
  } catch (error) {
    // fix error types because unknown as default
    const err = error as Error;
    res.status(400).json({ message: err.message });
  }
});

userRouter.post("/signin", async (req: SignInReq, res: Response) => {
  const userByMail = (await UserModel.findOne({
    email: req.body.email,
  })) as UserType;

  if (!userByMail) {
    res.status(404).json({ message: "User not found!" });
    return null;
  }

  if (!(await bcrypt.compare(req.body.password, userByMail.password))) {
    res.status(400).json({ message: "Password is not valid!" });
    return null;
  }

  // Create token
  const token = jwt.sign(
    { user_id: userByMail._id, email: req.body.email },
    process.env.TOKEN_KEY as string,
    {
      expiresIn: "2h",
    }
  );

  // save user token
  userByMail.token = token;

  res.json(userByMail);
});

// GET
userRouter.get("/currentUser", auth, async (req: UserReq, res: Response) => {
  const userId = checkExistsUserId(req, res);
  const currentUser = await UserModel.findOne({ _id: userId });

  if (!currentUser) {
    res.status(400).json({ message: "User not found!" });
    return null;
  }

  res.status(200).json(currentUser);
});

userRouter.get("/userById", auth, async (req: UserByIdReq, res: Response) => {
  const userId = req.query.userId;

  if (!userId) {
    res.status(400).json({ message: "User ID not found!" });
    return null;
  }

  const user = await UserModel.findOne({ _id: userId });

  if (!user) {
    res.status(400).json({ message: "User not found!" });
    return null;
  }

  res.status(200).json(user);
});

userRouter.get(
  "/searchByEmail",
  auth,
  async (req: SearchByEmail, res: Response) => {
    const searchTerm = req.query.searchTerm;
    const regex = new RegExp(searchTerm.trim().split(/\s+/).join("|"));
    const users = await UserModel.find({
      email: { $regex: regex, $options: "i" },
    });
    res.status(200).json(users);
  }
);

// example to use auth
userRouter.post("/welcome", auth, (req, res) => {
  res.status(200).send("Welcome 🙌 ");
});

module.exports = userRouter;
