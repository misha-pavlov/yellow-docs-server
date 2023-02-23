import { Response } from "express";
import { UserReq } from "../types/common.types";
import { EditDocument } from "../types/document.types";

const DocumentModel = require("../models/documentModel/documentModel");

export const getFieldsToEdit = async (req: EditDocument & UserReq) => {
  let editFields = {};
  const documentId = req.body.documentId;
  const newTitle = req.body?.newTitle;
  const newVisibleForUserId = req.body?.newVisibleForUserId;
  const newFavouriteUserId = req.body?.newFavouriteUserId;
  const newContent = req.body?.newContent;

  if (newTitle) {
    editFields = { title: newTitle };
  }

  if (newVisibleForUserId) {
    const document = await DocumentModel.findOne({ _id: documentId });

    if (document.visibleFor.includes(newVisibleForUserId)) {
      editFields = {
        visibleFor: document.visibleFor.filter(
          (id: string) => id !== newVisibleForUserId
        ),
      };
    } else {
      editFields = {
        visibleFor: [...document.visibleFor, newVisibleForUserId],
      };
    }
  }

  if (newFavouriteUserId) {
    const document = await DocumentModel.findOne({ _id: documentId });

    if (document.favouriteInUsers.includes(newFavouriteUserId)) {
      editFields = {
        favouriteInUsers: document.favouriteInUsers.filter(
          (id: string) => id !== newFavouriteUserId
        ),
      };
    } else {
      editFields = {
        favouriteInUsers: [...document.favouriteInUsers, newFavouriteUserId],
      };
    }
  }

  if (newContent) {
    editFields = { content: newContent };
  }

  return editFields;
};

export const getDocument = async (
  documentId: string | undefined,
  res: Response
) => {
  if (!documentId) {
    res.status(400).json({ message: "Document id not found!" });
    return null;
  }

  const document = await DocumentModel.findOne({ _id: documentId });

  if (!document) {
    res.status(400).json({ message: "Document not found!" });
    return null;
  }

  return document;
};
