"use strict";
module.exports = (sequelize, DataTypes) => {

  const Followship = sequelize.define(
    "Followship",
    {
      //設定欄位屬性
      FollowerId: DataTypes.INTEGER,
      FollowingId: DataTypes.INTEGER
    },
    {}
  );
  Followship.associate = function(models) {};
  return Followship;
};
