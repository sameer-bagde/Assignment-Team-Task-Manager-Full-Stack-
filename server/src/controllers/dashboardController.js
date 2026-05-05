const { Task, Project, User } = require('../models');
const { Op } = require('sequelize');

// ── GET /api/dashboard ────────────────────────────────────────────────────────
// Query params: projectId (optional), userId (optional)
exports.getDashboard = async (req, res) => {
  try {
    const { projectId, userId } = req.query;

    const where = {};
    if (projectId) where.projectId = projectId;

    // If ADMIN, further isolate tasks to only projects they created
    if (req.user.role === 'ADMIN') {
      const adminProjects = await Project.findAll({ where: { creatorId: req.user.id }, attributes: ['id'] });
      const adminProjectIds = adminProjects.map(p => p.id);
      
      if (projectId) {
        // If a specific project was requested, ensure the admin owns it
        if (!adminProjectIds.includes(Number(projectId))) {
          where.projectId = -1; // Force zero results
        }
      } else {
        // Otherwise, limit to all projects owned by this admin
        where.projectId = { [Op.in]: adminProjectIds };
      }
    }

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
        where: { creatorId: req.user.id },
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
