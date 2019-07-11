"use strict";
const bcrypt = require("bcrypt-nodejs");
const faker = require("faker");

// console.log(faseUserArray);
module.exports = {
  up: (queryInterface, Sequelize) => {
    //產生管理者
    queryInterface.bulkInsert(
      "Users",
      [
        {
          name: `root`,
          email: `root@example.com`,
          password: bcrypt.hashSync("12345678", bcrypt.genSaltSync(10), null),
          avatar: `https://uinames.com/api/photos/male/2.jpg`,
          introduction: faker.lorem.words(),
          role: "admin",
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    );
    //產生20基本用戶
    return queryInterface.bulkInsert(
      "Users",
      Array.from({ length: 10 }).map((data, index) => ({
        name: `user${index + 1}`,
        email: `user${index + 1}@example.com`,
        password: bcrypt.hashSync("123", bcrypt.genSaltSync(10), null),
        avatar: `https://uinames.com/api/photos/male/${index + 1}.jpg`,
        introduction: faker.lorem.words(),
        role: "",
        createdAt: new Date(),
        updatedAt: new Date()
      })),
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Users", null, {});
  }
};
