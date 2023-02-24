export type DocumentType = {
  _id: string;
  title: string;
  changedBy: string;
  changedAt: Date;
  owner: string;
  visibleFor: [string];
  favouriteInUsers: [string];
  content: string;
  openHistory: Array<{ userId: string; date: Date }>;
};

export enum OwnedEnum {
  BY_ANYONE = "BY_ANYONE",
  BY_ME = "BY_ME",
  NOT_BY_ME = "NOT_BY_ME",
}

export enum SortEnum {
  LAST_OPENED_BY_ME = "LAST_OPENED_BY_ME",
  LAST_MODIFIED_BY_ME = "LAST_MODIFIED_BY_ME",
  LAST_MODIFIED = "LAST_MODIFIED",
  TITLE = "TITLE",
}

export type GetAndDeleteDocumentType = {
  body: {
    documentId: string;
  };
};

export type GetRecentDocumentsType = {
  query: {
    searchTerm?: string;
    owned: OwnedEnum;
    sort: SortEnum;
  };
};

export type EditDocument = {
  body: {
    documentId: string;
    newTitle?: string;
    newVisibleForUserId?: string;
    newFavouriteUserId?: string;
    newContent?: string;
    updateOpenHistory?: boolean;
  };
};
