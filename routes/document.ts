import express, { Response } from "express";
import {
  getAdditionalRDFields,
  getDocument,
  getFieldsToEdit,
} from "../helpers/document.helpers";
import { UserReq } from "../types/common.types";
import {
  GetRecentDocumentsType,
  EditDocument,
  DocumentType,
  SortEnum,
  GetDocumentType,
  DeleteDocumentType,
  ConvertTo,
  UserAccessEnum,
} from "../types/document.types";
import { checkExistsUserId } from "../utils/checkExistsUserId";

const DocumentModel = require("../models/documentModel/documentModel");
const UserModel = require("../models/userModel/userModel");
const auth = require("../middleware/auth");
const documentRouter = express.Router();

// POST
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

// GET
documentRouter.get(
  "/getOne",
  auth,
  async (req: GetDocumentType, res: Response) => {
    const documentId = req.query.documentId;
    const document = await getDocument(documentId, res);
    res.status(200).json(document);
  }
);

documentRouter.get(
  "/getRecentDocuments",
  auth,
  async (req: UserReq & GetRecentDocumentsType, res: Response) => {
    const userId = checkExistsUserId(req, res) as string;
    const searchTerm = req.query.searchTerm || "";
    const regex = new RegExp(searchTerm.trim().split(/\s+/).join("|"));
    const sort = req.query.sort;

    const additionalFields = getAdditionalRDFields(req, userId);

    const recentDocuments = await DocumentModel.find({
      visibleFor: { $in: [userId] },
      title: { $regex: regex, $options: "i" },
      ...additionalFields,
    }).sort(
      (sort === SortEnum.LAST_MODIFIED && { changedAt: -1 }) ||
        (sort === SortEnum.TITLE && { title: 1 }) ||
        {}
    );

    if (!recentDocuments) {
      res.status(400).json({ message: "Recent documents not found!" });
      return null;
    }

    // Sorts
    if (sort === SortEnum.LAST_MODIFIED_BY_ME) {
      recentDocuments.sort((a: DocumentType, b: DocumentType) => {
        const userIdA = parseInt(a.changedBy.slice(4));
        const userIdB = parseInt(b.changedBy.slice(4));
        const certainUserId = parseInt(userId.slice(4));

        // If both objects have the same user id, use the default comparison
        if (userIdA === certainUserId && userIdB === certainUserId) {
          return 0;
        }

        // If object a has the target user id, prioritize it
        else if (userIdA === certainUserId) {
          return -1;
        }

        // If object b has the target user id, prioritize it
        else if (userIdB === certainUserId) {
          return 1;
        }

        // If neither object has the target user id, compare the user ids numerically
        else {
          return userIdA - userIdB;
        }
      });
    }

    if (sort === SortEnum.LAST_OPENED_BY_ME) {
      recentDocuments.sort((a: DocumentType, b: DocumentType) => {
        const userOpenHistoryDateA = a.openHistory.find(
          (obj: { userId: string; date: Date }) => obj.userId === userId
        )?.date;
        const userOpenHistoryDateB = b.openHistory.find(
          (obj: { userId: string; date: Date }) =>
            obj.userId === userId && obj.date
        )?.date;

        // @ts-ignore because this vars are date and ts thinks that we can not do "-" in dates
        return userOpenHistoryDateB - userOpenHistoryDateA;
      });
    }

    res.status(200).json(recentDocuments);
  }
);

documentRouter.get(
  "/getDocumentUsers",
  auth,
  async (req: GetDocumentType, res: Response) => {
    const documentId = req.query.documentId;
    const document = await getDocument(documentId, res);
    const userIds = document.visibleFor;
    const users = await UserModel.find({ _id: { $in: userIds } });
    res.status(200).json(users);
  }
);

// PATCH
documentRouter.patch(
  "/edit",
  auth,
  async (req: EditDocument & UserReq, res: Response) => {
    const userId = checkExistsUserId(req, res) as string;
    const documentId = req.body.documentId;
    const updateOpenHistory = req.body?.updateOpenHistory;

    if (!documentId) {
      res.status(400).json({ message: "Document id not found!" });
      return null;
    }

    const fieldsToEdit = await getFieldsToEdit(req, userId);

    await DocumentModel.findOneAndUpdate(
      { _id: documentId },
      {
        ...fieldsToEdit,
        ...(!updateOpenHistory && { changedBy: userId, changedAt: new Date() }),
      }
    );

    const editedDocument = await DocumentModel.findOne({ _id: documentId });

    res.status(200).json(editedDocument);
  }
);

documentRouter.patch(
  "/convertTo",
  auth,
  async (req: ConvertTo, res: Response) => {
    const newAccessType = req.body.accessType;
    const documentId = req.body.documentId;
    const userId = req.body.userId;

    const document = await getDocument(documentId, res);

    if (
      newAccessType === UserAccessEnum.READ_ONLY &&
      document.readOnlyMembers.includes(userId)
    ) {
      res.status(400).json({ message: "User already read only" });
      return null;
    }

    if (
      newAccessType === UserAccessEnum.FULL &&
      !document.readOnlyMembers.includes(userId)
    ) {
      res.status(400).json({ message: "User already has full access" });
      return null;
    }

    let newReadOnlyMembers;

    if (newAccessType === UserAccessEnum.READ_ONLY) {
      newReadOnlyMembers = [...document.readOnlyMembers, userId];
    } else {
      newReadOnlyMembers = document.readOnlyMembers.filter(
        (id: string) => id !== userId
      );
    }

    await DocumentModel.findOneAndUpdate(
      { _id: documentId },
      { readOnlyMembers: newReadOnlyMembers }
    );
  }
);

// DELETE
documentRouter.delete(
  "/delete",
  auth,
  async (req: DeleteDocumentType & UserReq, res: Response) => {
    const userId = checkExistsUserId(req, res);
    const documentId = req.body.documentId;
    const document = await getDocument(documentId, res);

    if (userId !== document.owner) {
      res.status(400).json({
        message: "You can not delete this document because you are not owner!",
      });
      return null;
    }

    const deletedDocument = await DocumentModel.findOneAndDelete({
      _id: documentId,
    });
    res.status(200).send(deletedDocument);
  }
);

module.exports = documentRouter;
