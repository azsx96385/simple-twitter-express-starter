"use strict";

let fakelike = [];
for (let i = 1; i < 50; i++) {
  let TweetId = Math.floor(Math.random() * 100);
  let UserId = Math.floor(Math.random() * 10);
  fakelike.push({
    UserId: UserId,
    TweetId: TweetId,
    createdAt: new Date(),
    updatedAt: new Date()
  });
}

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Likes", fakelike, {});
  },

  down: (queryInterface, Sequelize) => {
    Example: return queryInterface.bulkDelete("Likes", null, {});
  }
};
