"use strict";
let fakeReply = [];
for (let i = 1; i < 20; i++) {
  let TweetId = Math.floor(Math.random() * 100);
  let UserId = Math.ceil(Math.random() * 20);
  fakeReply.push(
    {
      UserId: UserId,
      TweetId: TweetId,
      comment: "On!NO!!我覺得不行",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      UserId: UserId,
      TweetId: TweetId,
      comment: "這個很可以啊!!!",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      UserId: UserId,
      TweetId: TweetId,
      comment: "我不是想下班，我是不想上班阿!!!!",
      createdAt: new Date(),
      updatedAt: new Date()
    }
  );
}

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Replies", fakeReply, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Replies", null, {});
  }
};
