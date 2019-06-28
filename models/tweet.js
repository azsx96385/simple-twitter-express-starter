"use strict";
module.exports = (sequelize, DataTypes) => {
  const Tweet = sequelize.define(
    "Tweet",
    {
      description: DataTypes.STRING,
      UserId: DataTypes.INTEGER
    },
    {}
  );
  Tweet.associate = function(models) {
    //關聯一 | User - tweet | 一對多關係
    Tweet.belongsTo(models.User);
  };
  return Tweet;
};
