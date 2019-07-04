"use strict";

let fakeFollowship = [];
for (let i = 1; i < 100; i++) {
  let FollowerId = Math.ceil(Math.random() * 20);
  let FollowingId = Math.ceil(Math.random() * 20);
  if (FollowerId === FollowingId) {
    fakeFollowship.push({
      FollowerId: FollowerId,
      FollowingId: FollowingId - 1 == 0 ? FollowingId + 1 : FollowingId - 1,
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
