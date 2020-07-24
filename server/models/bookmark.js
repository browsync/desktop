'use strict';
module.exports = (sequelize, DataTypes) => {
  const Sequelize = sequelize.Sequelize
  const Model = Sequelize.Model
  class Bookmark extends Model {}
  Bookmark.init({
    url: DataTypes.STRING,
    FolderId: DataTypes.INTEGER
  },{sequelize})
  
  Bookmark.associate = function(models) {
    Bookmark.belongsTo(models.Folder)
  };
  return Bookmark;
};