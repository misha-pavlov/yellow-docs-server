export type DocumentType = {
    _id: string;
    changedBy: string;
    changedAt: Date;
    owner: string;
    visibleFor: [string];
    favouriteInUsers: [string];
    content: string;
}

export type CreateReq = {
    body: {
        owner: string;
    }
}