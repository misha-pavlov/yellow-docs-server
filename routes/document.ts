import express from "express";
import { UserReq } from "../types/common.types";

const DocumentModel = require("../models/documentModel/documentModel");
const auth = require("../middleware/auth");
const documentRouter = express.Router();

documentRouter.post(
  "/create",
  auth,
  async (req: UserReq, res: express.Response) => {
    const userId = req.user && req.user.user_id;

    if (!userId) {
      res.status(400).json({ message: "User id not found!" });
      return null;
    }

    const document = new DocumentModel({
      owner: userId,
      changedBy: userId,
      changedAt: new Date(),
      visibleFor: [userId],
    });

    try {
      const documentToSave = await document.save();
      res.status(200).json(documentToSave);
    } catch (error) {
      // fix error types because unknown as default
      const err = error as Error;
      res.status(400).json({ message: err.message });
    }
  }
);

module.exports = documentRouter;
