import express from "express";
import crypto from "crypto";
import { CATS_MEMES_IMAGE_URLS } from "../static/images";
import { SignInReq, SignUpReq, UserType } from "../types/userTypes";

const UserModel = require("../models/userModel/userModel");
const userRouter = express.Router();

const salt = crypto.randomBytes(16).toString("hex");

const setPassword = (password: string) => {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString(`hex`);
};

const validPassword = async (password: string, userId: string) => {
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, `sha512`)
    .toString(`hex`);
  return UserModel.findOne({ _id: userId, password: hash });
};

userRouter.post("/signup", async (req: SignUpReq, res: express.Response) => {
  const isExistingUser = await UserModel.findOne({ email: req.body.email });

  if (isExistingUser) {
    res.status(400).json({ message: "User already exists!" });
    return null;
  }

  const randomNumber = Math.floor(Math.random() * 10);
  const image = CATS_MEMES_IMAGE_URLS[randomNumber];

  const data = new UserModel({
    image,
    email: req.body.email,
    lastName: req.body.lastName,
    firstName: req.body.firstName,
    password: setPassword(req.body.password),
  });

  try {
    const dataToSave = await data.save();
    res.status(200).json(dataToSave);
  } catch (error) {
    // fix error types because unknown as default
    const err = error as Error;
    res.status(400).json({ message: err.message });
  }
});

userRouter.get("/signin", async (req: SignInReq, res: express.Response) => {
  const userByMail = (await UserModel.findOne({
    email: req.body.email,
  })) as UserType;

  if (!userByMail) {
    res.status(404).json({ message: "User not found!" });
    return null;
  }

  if (!(await validPassword(req.body.password, userByMail._id))) {
    res.status(400).json({ message: "Password is not valid!" });
    return null;
  }

  res.json(userByMail);
});

module.exports = userRouter;

// tips
// router.post("/post", async (req, res) => {
//     const data = new UserModel({
//       name: req.body.name,
//       age: req.body.age,
//     });

//     try {
//       const dataToSave = await data.save();
//       res.status(200).json(dataToSave);
//     } catch (error) {
//       res.status(400).json({ message: error.message });
//     }
//   });

//   router.get("/getAll", async (req, res) => {
//     try {
//       const data = await UserModel.find();
//       res.json(data);
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   });

//   router.get("/getOne/:id", async (req, res) => {
//     try {
//       const data = await UserModel.findById(req.params.id);
//       res.json(data);
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   });

//   router.patch("/update/:id", async (req, res) => {
//     try {
//       const id = req.params.id;
//       const updatedData = req.body;
//       const options = { new: true };

//       const result = await UserModel.findByIdAndUpdate(id, updatedData, options);

//       res.send(result);
//     } catch (error) {
//       res.status(400).json({ message: error.message });
//     }
//   });

//   router.delete("/delete/:id", async (req, res) => {
//     try {
//       const id = req.params.id;
//       const data = await UserModel.findByIdAndDelete(id);
//       res.send(`Document with ${data.name} has been deleted..`);
//     } catch (error) {
//       res.status(400).json({ message: error.message });
//     }
//   });
