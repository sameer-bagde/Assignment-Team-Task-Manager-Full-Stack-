const { body, validationResult } = require('express-validator');
const { Task, User } = require('../models');

// ── Kanban formatter ──────────────────────────────────────────────────────────
const toKanban = (tasks) => {
  const tasksMap = {};
  const columns = {
    pending:     { id: 'pending',     title: 'Pending',     taskIDs: [] },
    in_progress: { id: 'in_progress', title: 'In Progress', taskIDs: [] },
    done:        { id: 'done',        title: 'Done',        taskIDs: [] },
  };

  tasks.forEach((t) => {
    const key = `task_${t.id}`;
    tasksMap[key] = {
      id:               t.id,
      title:            t.title,
      description:      t.description,
      dueDate:          t.dueDate,
      state:            t.state,
      assignees:        t.assignees ? t.assignees.map(a => ({ id: a.id, name: a.name })) : [],
    };
    if (columns[t.state]) columns[t.state].taskIDs.push(key);
  });

  return { tasks: tasksMap, columns, columnOrder: ['pending', 'in_progress', 'done'] };
};

// ── GET /api/projects/:id/tasks ───────────────────────────────────────────────
exports.listTasks = async (req, res) => {
  try {
    const tasks = await Task.findAll({
      where: { projectId: req.params.id },
      include: [{ model: User, as: 'assignees', attributes: ['id', 'name'], through: { attributes: [] } }],
      order: [['createdAt', 'ASC']],
    });

    let filteredTasks = tasks;
    if (req.user.role === 'MEMBER') {
      filteredTasks = tasks.filter(t => t.assignees && t.assignees.some(a => a.id === req.user.id));
    }

    return res.json(toKanban(filteredTasks));
  } catch (err) {
    console.error('List tasks error:', err);
    return res.status(500).json({ error: 'Failed to fetch tasks.' });
  }
};

// ── POST /api/projects/:id/tasks ──────────────────────────────────────────────
exports.createTaskValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
];

exports.createTask = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

  try {
    const { title, description = '', dueDate, assignees = [] } = req.body;
    const task = await Task.create({
      title,
      description,
      dueDate: dueDate || null,
      projectId: req.params.id,
      state: 'pending',
    });

    if (assignees && assignees.length > 0 && Array.isArray(assignees)) {
      const ids = assignees.map(a => typeof a === 'object' && a !== null ? a.id : a);
      await task.setAssignees(ids);
    }

    // Re-fetch with assignees included so the response is complete
    const fullTask = await Task.findByPk(task.id, {
      include: [{ model: User, as: 'assignees', attributes: ['id', 'name'], through: { attributes: [] } }],
    });

    return res.status(201).json(fullTask);
  } catch (err) {
    console.error('Create task error:', err);
    return res.status(500).json({ error: 'Failed to create task.' });
  }
};

// ── PATCH /api/projects/:id/tasks/:taskId ─────────────────────────────────────
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      where: { id: req.params.taskId, projectId: req.params.id },
      include: [{ model: User, as: 'assignees', attributes: ['id'] }]
    });
    if (!task) return res.status(404).json({ error: 'Task not found.' });

    const isAssigned = task.assignees && task.assignees.some(a => a.id === req.user.id);

    if (req.user.role === 'ADMIN') {
      // Admin can update all fields
      const { title, description, dueDate, state, assignees } = req.body;

      if (title       !== undefined) task.title       = title;
      if (description !== undefined) task.description = description;
      if (dueDate     !== undefined) task.dueDate     = dueDate || null;
      if (state       !== undefined) task.state       = state;

      // Update assignees: accepts either [5,7] or [{id:5,name:"x"},{id:7,name:"y"}]
      if (assignees !== undefined && Array.isArray(assignees)) {
        // Normalize to plain integer IDs regardless of input format
        const ids = assignees.map(a => typeof a === 'object' && a !== null ? a.id : a);
        console.log("setAssignees normalized IDs:", ids);
        await task.setAssignees(ids);
      }
    } else {
      // Other members can only update the state (drag and drop)
      const { state } = req.body;
      if (state !== undefined) task.state = state;
    }

    await task.save();

    // Re-fetch with assignees included so the response shows the updated associations
    const fullTask = await Task.findByPk(task.id, {
      include: [{ model: User, as: 'assignees', attributes: ['id', 'name'], through: { attributes: [] } }],
    });

    return res.json(fullTask);
  } catch (err) {
    console.error('Update task error:', err);
    return res.status(500).json({ error: 'Failed to update task.' });
  }
};

// ── DELETE /api/projects/:id/tasks/:taskId ────────────────────────────────────
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      where: { id: req.params.taskId, projectId: req.params.id },
    });
    if (!task) return res.status(404).json({ error: 'Task not found.' });
    await task.destroy();
    return res.json({ message: 'Task deleted.' });
  } catch (err) {
    console.error('Delete task error:', err);
    return res.status(500).json({ error: 'Failed to delete task.' });
  }
};
