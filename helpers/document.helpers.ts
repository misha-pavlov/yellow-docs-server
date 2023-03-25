import { Response } from "express";
import { UserReq } from "../types/common.types";
import {
  EditDocumentType,
  GetRecentDocumentsType,
  OwnedEnum,
} from "../types/document.types";

const DocumentModel = require("../models/documentModel/documentModel");

export const getFieldsToEdit = async (
  req: EditDocumentType & UserReq,
  userId: string
) => {
  let editFields = {};
  const documentId = req.body.documentId;
  const newTitle = req.body?.newTitle;
  const newVisibleForUserId = req.body?.newVisibleForUserId;
  const newFavouriteUserId = req.body?.newFavouriteUserId;
  const newContent = req.body?.newContent;
  const updateOpenHistory = req.body?.updateOpenHistory;
  const newReadOnlyMemberId = req.body?.newReadOnlyMemberId;

  const document = await DocumentModel.findOne({ _id: documentId });

  if (newTitle) {
    editFields = { title: newTitle };
  }

  if (newVisibleForUserId) {
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

  if (newReadOnlyMemberId) {
    if (document.readOnlyMembers.includes(newReadOnlyMemberId)) {
      editFields = {
        readOnlyMembers: document.readOnlyMembers.filter(
          (id: string) => id !== newReadOnlyMemberId
        ),
      };
    } else {
      editFields = {
        readOnlyMembers: [...document.readOnlyMembers, newReadOnlyMemberId],
      };
    }
  }

  if (newContent) {
    editFields = { content: newContent };
  }

  if (updateOpenHistory) {
    const newElement = { userId, date: new Date() };

    if (document.openHistory.includes(userId)) {
      const filteredArray = document.openHistory.filter(
        (obj: { userId: string }) => obj.userId !== userId
      );
      editFields = { openHistory: [...filteredArray, newElement] };
    } else {
      editFields = {
        openHistory: newElement,
      };
    }
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

// additional filter fields for Recent Documents
export const getAdditionalRDFields = (
  req: UserReq & GetRecentDocumentsType,
  userId: string
) => {
  let additionalFields = {};
  const owned = req.query.owned;

  if (owned === OwnedEnum.BY_ME) {
    additionalFields = { owner: userId };
  }

  if (owned === OwnedEnum.NOT_BY_ME) {
    additionalFields = { owner: { $nin: [userId] } };
  }

  return additionalFields;
};
