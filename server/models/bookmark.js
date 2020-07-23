'use strict';
module.exports = (sequelize, DataTypes) => {
  const Sequelize = sequelize.Sequelize
  const Model = Sequelize.Model
  class Bookmark extends Model {}
  Bookmark.init({
    url: DataTypes.STRING,
    UserId: DataTypes.INTEGER
  }, {sequelize});
  Bookmark.associate = function(models) {
    // associations can be defined here
    Bookmark.belongsTo(models.User, {
      sourceKey: "UserId",
      targetKey: "id"
    })
  };
  return Bookmark;
};