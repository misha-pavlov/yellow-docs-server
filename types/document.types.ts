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

export type GetDocumentType = {
  body: {
    documentId: string;
  };
};

export type GetRecentDocumentsType = {
  body: {
    searchTerm?: string;
  };
};

export type EditDocument = {
    body: {
        documentId: string;
        newTitle?: string;
        newVisibleForUserId?: string;
        newFavouriteUserId?: string;
        newContent?: string;
    }
}