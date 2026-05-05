const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TaskAssignee = sequelize.define(
  'TaskAssignee',
  {
    taskId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'tasks', key: 'id' } },
    userId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'users', key: 'id' } },
  },
  { tableName: 'task_assignees', timestamps: false }
);

module.exports = TaskAssignee;
