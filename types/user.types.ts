export type UserType = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  image: string;
  token: string;
};

export type SignUpReq = {
  body: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  };
};

export type SignInReq = {
  body: {
    email: string;
    password: string;
  };
};

export type UserByIdReq = {
  query: {
    userId: string;
  };
};

export type SearchByEmail = {
  query: {
    searchTerm: string;
    documentId: string;
  };
};
