export type DocumentType = {
  _id: string;
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
    searchTerm: string;
  };
};
