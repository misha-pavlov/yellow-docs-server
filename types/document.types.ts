export type DocumentType = {
  _id: string;
  title: string;
  changedBy: string;
  changedAt: Date;
  owner: string;
  visibleFor: [string];
  favouriteInUsers: [string];
  readOnlyMembers: [string];
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

export enum UserAccessEnum {
  READ_ONLY = "READ_ONLY",
  FULL = "FULL",
}

export type DeleteDocumentType = {
  body: {
    documentId: string;
  };
};

export type GetDocumentType = {
  query: {
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

export type EditDocumentType = {
  body: {
    documentId: string;
    newTitle?: string;
    newVisibleForUserId?: string;
    newFavouriteUserId?: string;
    newContent?: string;
    updateOpenHistory?: boolean;
    newReadOnlyMemberId?: boolean;
  };
};

export type ConvertToType = {
  body: {
    userId: string;
    documentId: string;
    accessType: UserAccessEnum;
  };
};

export type ApplyTemplateType = {
  body: {
    title: string;
    owner: string;
    content: string;
  };
};
