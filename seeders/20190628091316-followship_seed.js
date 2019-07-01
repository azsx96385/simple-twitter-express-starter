"use strict";

let fakeFollowship = [];
for (let i = 1; i < 20; i++) {
  let FollowerId = Math.floor(Math.random() * 10);
  let FollowingId = Math.floor(Math.random() * 10);
  if (FollowerId === FollowingId) {
    fakeFollowship.push({
      FollowerId: FollowerId,
      FollowingId: FollowingId - 1,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  } else {
    fakeFollowship.push({
      FollowerId: FollowerId,
      FollowingId: FollowingId,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }
}

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Followships", fakeFollowship, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Followships", null, {});
  }
};
