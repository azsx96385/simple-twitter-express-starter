"use strict";

let fakeTweet = [];
for (let i = 0; i < 100; i++) {
  fakeTweet.push({
    UserId: Math.floor(Math.random() * 10),
    description: "發大財|發大財|發發發發發",
    createdAt: new Date(),
    updatedAt: new Date()
  });
}

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Tweets", fakeTweet, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Tweets", null, {});
  }
};
