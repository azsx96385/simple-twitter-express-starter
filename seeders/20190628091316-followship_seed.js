"use strict";

let fakeFollowship = [];
for (let i = 1; i < 100; i++) {
  let FollowerId = Math.ceil(Math.random() * 10);
  let FollowingId = Math.ceil(Math.random() * 10);
  if (FollowerId === FollowingId) {
    fakeFollowship.push({
      followerId: FollowerId,
      followingId: FollowingId - 1 == 0 ? FollowingId + 1 : FollowingId - 1,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  } else {
    fakeFollowship.push({
      followerId: FollowerId,
      followingId: FollowingId,
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
