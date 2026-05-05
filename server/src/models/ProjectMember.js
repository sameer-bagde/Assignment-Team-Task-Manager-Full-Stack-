const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ProjectMember = sequelize.define(
  'ProjectMember',
  {
    projectId: { type: DataTypes.INTEGER, allowNull: false },
    userId:    { type: DataTypes.INTEGER, allowNull: false },
  },
  { tableName: 'project_members', timestamps: false }
);

module.exports = ProjectMember;
