"use strict";
const bcrypt = require("bcrypt-nodejs");
const faker = require("faker");

//fake-userdata array
let faseUserArray = [];
for (let i = 1; i < 11; i++) {
  faseUserArray.push({
    name: `user${i}`,
    email: `user${i}@example.com`,
    password: bcrypt.hashSync("123", bcrypt.genSaltSync(10), null),
    avatar: `https://uinames.com/api/photos/male/${i}.jpg`,
    createdAt: new Date(),
    updatedAt: new Date()
  });
}
// console.log(faseUserArray);
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Users", faseUserArray, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Users", null, {});
  }
};
