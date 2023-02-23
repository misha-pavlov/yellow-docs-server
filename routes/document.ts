import express, { Response } from "express";
import { UserReq } from "../types/common.types";
import { GetDocumentType } from "../types/document.types";

const DocumentModel = require("../models/documentModel/documentModel");
const auth = require("../middleware/auth");
const documentRouter = express.Router();

documentRouter.post("/create", auth, async (req: UserReq, res: Response) => {
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
});

documentRouter.get(
  "/getDocument",
  auth,
  async (req: GetDocumentType, res: Response) => {
    const documentId = req.body.documentId;
    console.log("🚀 ~ file: document.ts:39 ~ documentId:", documentId);

    if (!documentId) {
      res.status(400).json({ message: "Document id not found!" });
      return null;
    }

    const document = await DocumentModel.findOne({ _id: documentId });

    if (!document) {
      res.status(400).json({ message: "Document not found!" });
      return null;
    }

    res.status(200).json(document);
  }
);

module.exports = documentRouter;
