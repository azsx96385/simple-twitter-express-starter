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
    //關聯二 | User-tweet Like | 多對多
    Tweet.belongsToMany(models.User, {
      through: models.Like,
      foreignKey: "TweetId",
      as: "Likes"
    });
  };
  return Tweet;
};
