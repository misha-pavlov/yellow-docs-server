import express, { Response } from "express";
import { getFieldsToEdit } from "../helpers/document.helpers";
import { UserReq } from "../types/common.types";
import {
  GetAndDeleteDocumentType,
  GetRecentDocumentsType,
  EditDocument,
} from "../types/document.types";
import { checkExistsUserId } from "../utils/checkExistsUserId";

const DocumentModel = require("../models/documentModel/documentModel");
const auth = require("../middleware/auth");
const documentRouter = express.Router();

documentRouter.post("/create", auth, async (req: UserReq, res: Response) => {
  const userId = checkExistsUserId(req, res);
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
  "/getOne",
  auth,
  async (req: GetAndDeleteDocumentType, res: Response) => {
    const documentId = req.body.documentId;

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

documentRouter.get(
  "/getRecentDocuments",
  auth,
  async (req: UserReq & GetRecentDocumentsType, res: Response) => {
    const userId = checkExistsUserId(req, res);
    const searchTerm = req.body.searchTerm || "";
    const regex = new RegExp(searchTerm.trim().split(/\s+/).join("|"));

    const recentDocuments = await DocumentModel.find({
      visibleFor: { $in: [userId] },
      title: { $regex: regex, $options: "i" },
    }).sort({ changedAt: -1 });

    if (!recentDocuments) {
      res.status(400).json({ message: "Recent documents not found!" });
      return null;
    }

    res.status(200).json(recentDocuments);
  }
);

documentRouter.patch(
  "/edit",
  auth,
  async (req: EditDocument & UserReq, res: Response) => {
    const userId = checkExistsUserId(req, res);
    const documentId = req.body.documentId;

    if (!documentId) {
      res.status(400).json({ message: "Document id not found!" });
      return null;
    }

    const fieldsToEdit = await getFieldsToEdit(req);

    await DocumentModel.findOneAndUpdate(
      { _id: documentId },
      { ...fieldsToEdit, changedBy: userId, changedAt: new Date() }
    );

    const editedDocument = await DocumentModel.findOne({ _id: documentId });

    res.status(200).json(editedDocument);
  }
);

documentRouter.delete(
  "/delete",
  auth,
  async (req: GetAndDeleteDocumentType & UserReq, res: Response) => {
    const userId = checkExistsUserId(req, res);
    const documentId = req.body.documentId;

    if (!documentId) {
      res.status(400).json({ message: "Document id not found!" });
      return null;
    }

    const document = await DocumentModel.findOne({ _id: documentId });

    if (!document) {
      res.status(400).json({ message: "Document not found!" });
      return null;
    }

    if (userId !== document.owner) {
      res.status(400).json({
        message: "You can not delete this document because you are not owner!",
      });
      return null;
    }

    await DocumentModel.deleteOne({ _id: documentId });
    res.status(200).send("Deleted!");
  }
);

module.exports = documentRouter;
