import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { CATS_MEMES_IMAGE_URLS } from "../static/images";
import { SignInReq, SignUpReq, UserType } from "../types/userTypes";

const UserModel = require("../models/userModel/userModel");
const auth = require("../middleware/auth");
const userRouter = express.Router();

userRouter.post("/signup", async (req: SignUpReq, res: express.Response) => {
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

userRouter.post("/signin", async (req: SignInReq, res: express.Response) => {
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

// example to use auth
userRouter.post("/welcome", auth, (req, res) => {
  res.status(200).send("Welcome 🙌 ");
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
