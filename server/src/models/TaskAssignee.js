const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TaskAssignee = sequelize.define(
  'TaskAssignee',
  {
    taskId: { type: DataTypes.INTEGER, allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: false },
  },
  { tableName: 'task_assignees', timestamps: false }
);

module.exports = TaskAssignee;
