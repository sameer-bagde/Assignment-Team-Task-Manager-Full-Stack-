const { body, validationResult } = require('express-validator');
const { Project, User, ProjectMember } = require('../models');

// ── Helpers ───────────────────────────────────────────────────────────────────
const projectFields = ['id', 'name', 'description', 'createdAt'];

// ── GET /api/projects ─────────────────────────────────────────────────────────
exports.listProjects = async (req, res) => {
  try {
    let projects;
    if (req.user.role === 'ADMIN') {
      // ADMIN sees only projects they created
      projects = await Project.findAll({
        attributes: projectFields,
        include: [{ model: User, as: 'members', attributes: ['id', 'name', 'email', 'role'], through: { attributes: [] } }],
        where: { creatorId: req.user.id },
        order: [['createdAt', 'DESC']],
      });
    } else {
      // MEMBER sees only joined projects
      projects = await Project.findAll({
        attributes: projectFields,
        include: [{ model: User, as: 'members', attributes: ['id', 'name', 'email', 'role'], through: { attributes: [] } }],
        where: { '$members.id$': req.user.id },
        order: [['createdAt', 'DESC']],
      });
    }
    return res.json(projects);
  } catch (err) {
    console.error('List projects error:', err);
    return res.status(500).json({ error: 'Failed to fetch projects.' });
  }
};

// ── POST /api/projects ────────────────────────────────────────────────────────
exports.createProjectValidation = [
  body('name').trim().notEmpty().withMessage('Project name is required'),
];

exports.createProject = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

  try {
    const { name, description = '' } = req.body;
    const project = await Project.create({ name, description, creatorId: req.user.id });

    // Auto-add the creating admin as a project member
    await ProjectMember.create({ projectId: project.id, userId: req.user.id });

    return res.status(201).json(project);
  } catch (err) {
    console.error('Create project error:', err);
    return res.status(500).json({ error: 'Failed to create project.' });
  }
};

// ── DELETE /api/projects/:id ──────────────────────────────────────────────────
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found.' });
    await project.destroy();
    return res.json({ message: 'Project deleted successfully.' });
  } catch (err) {
    console.error('Delete project error:', err);
    return res.status(500).json({ error: 'Failed to delete project.' });
  }
};

// ── GET /api/projects/:id/members ─────────────────────────────────────────────
exports.listProjectMembers = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id, {
      include: [{ model: User, as: 'members', attributes: ['id', 'name', 'email', 'role'], through: { attributes: [] } }],
    });
    if (!project) return res.status(404).json({ error: 'Project not found.' });
    return res.json(project.members);
  } catch (err) {
    console.error('List members error:', err);
    return res.status(500).json({ error: 'Failed to fetch project members.' });
  }
};

// ── POST /api/projects/:id/members ────────────────────────────────────────────
exports.addProjectMember = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(422).json({ error: 'userId is required.' });

    const project = await Project.findByPk(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found.' });

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: 'User not found.' });

    const [, created] = await ProjectMember.findOrCreate({
      where: { projectId: project.id, userId: user.id },
    });

    if (!created) return res.status(409).json({ error: 'User is already a member.' });

    return res.status(201).json({ message: `${user.name} added to project.` });
  } catch (err) {
    console.error('Add member error:', err);
    return res.status(500).json({ error: 'Failed to add member.' });
  }
};

// ── DELETE /api/projects/:id/members/:userId ──────────────────────────────────
exports.removeProjectMember = async (req, res) => {
  try {
    const deleted = await ProjectMember.destroy({
      where: { projectId: req.params.id, userId: req.params.userId },
    });
    if (!deleted) return res.status(404).json({ error: 'Member not found in project.' });
    return res.json({ message: 'Member removed from project.' });
  } catch (err) {
    console.error('Remove member error:', err);
    return res.status(500).json({ error: 'Failed to remove member.' });
  }
};
