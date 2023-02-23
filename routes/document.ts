import express from "express";
import { CreateReq } from "../types/documentTypes";

const DocumentModel = require("../models/documentModel/documentModel");
const auth = require("../middleware/auth");
const documentRouter = express.Router();

documentRouter.post(
  "/create",
  auth,
  async (req: CreateReq, res: express.Response) => {
    const owner = req.body.owner;

    const document = new DocumentModel({
      owner,
      changedBy: owner,
      changedAt: new Date(),
      visibleFor: [owner],
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