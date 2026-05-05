const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Project = sequelize.define(
  'Project',
  {
    id:          { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name:        { type: DataTypes.STRING(200), allowNull: false },
    description: { type: DataTypes.TEXT, defaultValue: '' },
  },
  { tableName: 'projects', timestamps: true }
);

module.exports = Project;
