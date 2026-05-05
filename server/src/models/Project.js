const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Project = sequelize.define(
  'Project',
  {
    id:          { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name:        { type: DataTypes.STRING(200), allowNull: false },
    description: { type: DataTypes.TEXT, defaultValue: '' },
    creatorId:   { type: DataTypes.INTEGER, allowNull: true },
  },
  { tableName: 'projects', timestamps: true }
);

module.exports = Project;
