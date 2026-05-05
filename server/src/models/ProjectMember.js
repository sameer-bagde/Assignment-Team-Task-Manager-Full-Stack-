const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ProjectMember = sequelize.define(
  'ProjectMember',
  {
    projectId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'projects', key: 'id' } },
    userId:    { type: DataTypes.INTEGER, allowNull: false, references: { model: 'users',    key: 'id' } },
  },
  { tableName: 'project_members', timestamps: false }
);

module.exports = ProjectMember;
