import { User } from "../models/users.js";

export const MOCK_USER = {
  // NOTE: We set the actual userId after the user is created in the database.
  // This way in production, the userId never matches.
  userId: "MOCK_USER_1",
  name: "Mock User",
  avatar: null,
};

export const MOCK_USER_2 = {
  userId: "MOCK_USER_2",
  name: "Mock User 2",
  avatar: null,
};

export const setupMockUsers = () => {
  if (process.env.NODE_ENV !== "development") {
    throw new Error("Mock users can only be set up in development mode.");
  }

  // Setup first mock user
  User.findOne({
    where: {
      name: MOCK_USER.name,
      provider: "github",
      providerUserId: "mock",
    },
  }).then((user) => {
    if (user) {
      console.log("Mock user 1 already exists, skipping creation.");
      MOCK_USER.userId = user.userId;
      return;
    }

    User.create({
      name: MOCK_USER.name,
      email: "example@gmail.com",
      provider: "github",
      providerUserId: "mock",
      active: true,
    }).then((user) => {
      MOCK_USER.userId = user.userId;
    });
  });

  // Setup second mock user
  User.findOne({
    where: {
      name: MOCK_USER_2.name,
      provider: "github",
      providerUserId: "mock2",
    },
  }).then((user) => {
    if (user) {
      console.log("Mock user 2 already exists, skipping creation.");
      MOCK_USER_2.userId = user.userId;
      return;
    }

    User.create({
      name: MOCK_USER_2.name,
      email: "example2@gmail.com",
      provider: "github",
      providerUserId: "mock2",
      active: true,
    }).then((user) => {
      MOCK_USER_2.userId = user.userId;
    });
  });
};
