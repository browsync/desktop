'use strict';
module.exports = (sequelize, DataTypes) => {
  const Sequelize = sequelize.Sequelize
  const Model = Sequelize.Model
  class Folder extends Model {}
  Folder.init({
    name: DataTypes.STRING,
    UserId: DataTypes.INTEGER,
    FolderId: DataTypes.INTEGER
  },{sequelize})
  
  Folder.associate = function(models) {
    Folder.belongsTo(models.User)
    Folder.belongsTo(models.Folder,{foreignKey: 'FolderId',as: 'Parent'})
    Folder.hasMany(models.Folder,{as: 'Child'})
    Folder.hasMany(models.Bookmark)
  };
  return Folder;
};