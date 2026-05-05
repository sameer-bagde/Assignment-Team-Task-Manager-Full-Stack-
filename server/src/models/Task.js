const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Task = sequelize.define(
  'Task',
  {
    id:          { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title:       { type: DataTypes.STRING(300), allowNull: false },
    description: { type: DataTypes.TEXT, defaultValue: '' },
    state:       { type: DataTypes.ENUM('pending', 'in_progress', 'done'), defaultValue: 'pending', allowNull: false },
    dueDate:     { type: DataTypes.DATEONLY, allowNull: true },
    projectId:   { type: DataTypes.INTEGER, allowNull: false, references: { model: 'projects', key: 'id' } },
  },
  { tableName: 'tasks', timestamps: true }
);

module.exports = Task;
