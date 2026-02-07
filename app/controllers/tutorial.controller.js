const db = require("../models");
const Tutorial = db.tutorials;

// Create and save a new Tutorial
exports.create = async (req, res) => {
  // Validate request
  if (!req.body.title) {
    return res.status(400).json({ message: "Title cannot be empty." });
  }

  const tutorial = {
    title: req.body.title,
    description: req.body.description || null,
    published: req.body.published ? true : false,
  };

  try {
    const data = await Tutorial.create(tutorial);
    return res.status(201).json(data);
  } catch (err) {
    return res.status(500).json({
      message: err.message || "An error occurred while creating the Tutorial.",
    });
  }
};

// Retrieve all Tutorials (with optional title filter via query param)
exports.findAll = async (req, res) => {
  const { title, published } = req.query;

  const where = {};
  if (title) {
    where.title = { [db.Sequelize.Op.iLike]: `%${title}%` };
  }
  if (published !== undefined) {
    where.published = published === "true";
  }

  try {
    const data = await Tutorial.findAll({ where });
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({
      message: err.message || "An error occurred while retrieving tutorials.",
    });
  }
};

// Find a single Tutorial by id
exports.findOne = async (req, res) => {
  const id = req.params.id;

  try {
    const data = await Tutorial.findByPk(id);
    if (!data) {
      return res.status(404).json({ message: `Tutorial with id=${id} not found.` });
    }
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({
      message: err.message || `Error retrieving Tutorial with id=${id}.`,
    });
  }
};

// Update a Tutorial by id
exports.update = async (req, res) => {
  const id = req.params.id;

  try {
    const [num] = await Tutorial.update(req.body, { where: { id } });
    if (num === 1) {
      const updated = await Tutorial.findByPk(id);
      return res.status(200).json(updated);
    }
    return res.status(404).json({
      message: `Tutorial with id=${id} not found. Cannot update.`,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message || `Error updating Tutorial with id=${id}.`,
    });
  }
};

// Delete a Tutorial by id
exports.delete = async (req, res) => {
  const id = req.params.id;

  try {
    const num = await Tutorial.destroy({ where: { id } });
    if (num === 1) {
      return res.status(200).json({ message: "Tutorial was deleted successfully." });
    }
    return res.status(404).json({
      message: `Tutorial with id=${id} not found. Cannot delete.`,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message || `Could not delete Tutorial with id=${id}.`,
    });
  }
};

// Delete all Tutorials
exports.deleteAll = async (_req, res) => {
  try {
    const num = await Tutorial.destroy({ where: {}, truncate: false });
    return res.status(200).json({
      message: `${num} tutorial(s) were deleted successfully.`,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message || "An error occurred while removing all tutorials.",
    });
  }
};
