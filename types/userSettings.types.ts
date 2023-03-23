export type UserSettingsType = {
  _id: string;
  userId: string;
  settings: {
    displayRecentTemplates: boolean;
  };
};

export type UpdateUserSettingsType = {
  body: {
    newSettings: UserSettingsType["settings"];
  };
};
