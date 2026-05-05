const sequelize    = require('../config/database');
const User          = require('./User');
const Project       = require('./Project');
const Task          = require('./Task');
const Comment       = require('./Comment');
const ProjectMember = require('./ProjectMember');
const TaskAssignee  = require('./TaskAssignee');

// ── Associations ──────────────────────────────────────────────────────────────

// Project ↔ User (Many-to-Many via ProjectMembers)
Project.belongsToMany(User, { through: ProjectMember, foreignKey: 'projectId', as: 'members' });
User.belongsToMany(Project, { through: ProjectMember, foreignKey: 'userId',    as: 'projects' });

// Project → Tasks (One-to-Many)
Project.hasMany(Task, { foreignKey: 'projectId', as: 'tasks', onDelete: 'CASCADE' });
Task.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });

// Task ↔ User (Many-to-Many via TaskAssignee)
Task.belongsToMany(User, { through: TaskAssignee, foreignKey: 'taskId', as: 'assignees' });
User.belongsToMany(Task, { through: TaskAssignee, foreignKey: 'userId', as: 'assignedTasks' });

// Task → Comments (One-to-Many)
Task.hasMany(Comment, { foreignKey: 'taskId', as: 'comments', onDelete: 'CASCADE' });
Comment.belongsTo(Task, { foreignKey: 'taskId', as: 'task' });

// User → Comments (One-to-Many)
User.hasMany(Comment, { foreignKey: 'userId', as: 'comments' });
Comment.belongsTo(User, { foreignKey: 'userId', as: 'User' });

module.exports = { sequelize, User, Project, Task, Comment, ProjectMember, TaskAssignee };
