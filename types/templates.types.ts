export type TemplatesType = {
  _id: string;
  title: string;
  owner: string;
  content: string;
};

export type CreateType = {
  body: {
    title: string;
    content: string;
  };
};
