"use strict";
module.exports = (sequelize, DataTypes) => {
  const Followship = sequelize.define(
    "Followship",
    {
      //設定欄位屬性
      followerId: DataTypes.INTEGER,
      followingId: DataTypes.INTEGER
    },
    {}
  );
  Followship.associate = function(models) {};
  return Followship;
};
