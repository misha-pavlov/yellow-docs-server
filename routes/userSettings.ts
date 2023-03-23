import express, { Response } from "express";
import { UserReq } from "../types/common.types";
import { UpdateUserSettingsType } from "../types/userSettings.types";
import { checkExistsUserId } from "../utils/checkExistsUserId";

const UserSettingsModel = require("../models/userSettingsModel/userSettingsModel");
const auth = require("../middleware/auth");
const userSettingsRouter = express.Router();

// POST
userSettingsRouter.post(
  "/create",
  auth,
  async (req: UserReq, res: Response) => {
    const userId = checkExistsUserId(req, res);

    // check has user settings in db
    const hasUserSettings = await UserSettingsModel.findOne({ userId });
    if (hasUserSettings) {
      return null;
    }

    // create new user settings
    const userSettings = new UserSettingsModel({ userId });

    try {
      const userSettingsToSave = await userSettings.save();
      res.status(201).json(userSettingsToSave);
    } catch (error) {
      // fix error types because unknown as default
      const err = error as Error;
      res.status(400).json({ message: err.message });
    }
  }
);

// GET
userSettingsRouter.get(
  "/getUserSettings",
  auth,
  async (req: UserReq, res: Response) => {
    const userId = checkExistsUserId(req, res);
    const userSettings = await UserSettingsModel.findOne({ userId });

    if (!userSettings) {
      res.status(400).json({ message: "User settings did not fing!" });
      return null;
    }

    res.status(200).json(userSettings);
  }
);

//PATCH
userSettingsRouter.patch(
  "/updateUserSettings",
  auth,
  async (req: UserReq & UpdateUserSettingsType, res: Response) => {
    const userId = checkExistsUserId(req, res);
    const newSettings = req.body.newSettings;

    // do update
    await UserSettingsModel.findOneAndUpdate(
      { userId },
      { settings: newSettings }
    );

    // get new value
    const updatedUserSettings = await UserSettingsModel.findOne({ userId });

    res.status(200).json(updatedUserSettings);
  }
);

module.exports = userSettingsRouter;