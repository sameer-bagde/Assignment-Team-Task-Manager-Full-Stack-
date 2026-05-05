const { Task, Project, User } = require('../models');
const { Op } = require('sequelize');

// ── GET /api/dashboard ────────────────────────────────────────────────────────
// Query params: projectId (optional), userId (optional)
exports.getDashboard = async (req, res) => {
  try {
    const { projectId, userId } = req.query;

    // Build base where clause
    const where = {};
    if (projectId) where.projectId = projectId;

    let targetUserId = userId;
    // If MEMBER, limit to their assigned tasks
    if (req.user.role === 'MEMBER') targetUserId = req.user.id;

    const include = [];
    if (targetUserId) {
      include.push({
        model: User,
        as: 'assignees',
        where: { id: targetUserId },
        attributes: []
      });
    }

    const countOptions = (stateWhere) => ({
      where: { ...where, ...stateWhere },
      include,
      distinct: true
    });

    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const [total, completed, pending, overdue] = await Promise.all([
      Task.count(countOptions({})),
      Task.count(countOptions({ state: 'done' })),
      Task.count(countOptions({ state: ['pending', 'in_progress'] })),
      Task.count(countOptions({
        state: { [Op.ne]: 'done' },
        dueDate: { [Op.lt]: now },
      })),
    ]);

    const inProgress = await Task.count(countOptions({ state: 'in_progress' }));

    // Projects summary (admin only)
    let projects = [];
    if (req.user.role === 'ADMIN') {
      projects = await Project.findAll({
        attributes: ['id', 'name'],
        order: [['name', 'ASC']],
      });
    }

    // My tasks list (member only) — actual task rows with project name
    let myTasks = [];
    if (req.user.role === 'MEMBER') {
      const memberTasks = await Task.findAll({
        include: [
          {
            model: User,
            as: 'assignees',
            where: { id: req.user.id },
            attributes: [],
          },
          {
            model: Project,
            as: 'project',
            attributes: ['id', 'name'],
          },
        ],
        order: [['dueDate', 'ASC']],
      });
      myTasks = memberTasks.map(t => ({
        id: t.id,
        title: t.title,
        description: t.description,
        dueDate: t.dueDate,
        state: t.state,
        projectId: t.projectId,
        projectName: t.project ? t.project.name : '',
      }));
    }

    return res.json({
      total,
      completed,
      pending,
      inProgress,
      overdue,
      projects,
      myTasks,
    });
  } catch (err) {
    console.error('Dashboard error:', err);
    return res.status(500).json({ error: 'Failed to load dashboard data.' });
  }
};
