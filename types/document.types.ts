export type DocumentType = {
  _id: string;
  title: string;
  changedBy: string;
  changedAt: Date;
  owner: string;
  visibleFor: [string];
  favouriteInUsers: [string];
  content: string;
};

export enum OwnedEnum {
  BY_ANYONE = "BY_ANYONE",
  BY_ME = "BY_ME",
  NOT_BY_ME = "NOT_BY_ME",
}

export type GetAndDeleteDocumentType = {
  body: {
    documentId: string;
  };
};

export type GetRecentDocumentsType = {
  body: {
    searchTerm?: string;
    owned: OwnedEnum;
  };
};

export type EditDocument = {
  body: {
    documentId: string;
    newTitle?: string;
    newVisibleForUserId?: string;
    newFavouriteUserId?: string;
    newContent?: string;
  };
};
