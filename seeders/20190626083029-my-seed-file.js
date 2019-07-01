'use strict';
const bcrypt = require('bcrypt-nodejs')
const faker = require('faker')

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.bulkInsert('Users', [{
      email: 'root@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      role: true,
      name: "root",
      avatar: "https://fakeimg.pl/300/",
      introduction: faker.lorem.text(),
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      email: 'user1@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      role: false,
      name: "user1",
      avatar: "https://fakeimg.pl/300/",
      introduction: faker.lorem.text(),
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      email: 'user2@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      role: false,
      name: "user2",
      avatar: "https://fakeimg.pl/300/",
      introduction: faker.lorem.text(),
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});

    return queryInterface.bulkInsert('Tweets',
      Array.from({ length: 10 }).map(d =>
        ({
          description: faker.lorem.text(),
          UserId: Math.floor(Math.random() * 2) + 1,
          createdAt: new Date(),
          updatedAt: new Date()
        })
      ), {});
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.bulkDelete('Users', null, {});
    return queryInterface.bulkDelete('Tweets', null, {});
  }
};