module.exports = (app) => {
  const tutorials = require("../controllers/tutorial.controller.js");
  const router = require("express").Router();

  // Create a new Tutorial
  router.post("/", tutorials.create);

  // Retrieve all Tutorials (optional query: ?title=keyword&published=true)
  router.get("/", tutorials.findAll);

  // Retrieve a single Tutorial by id
  router.get("/:id", tutorials.findOne);

  // Update a Tutorial by id
  router.put("/:id", tutorials.update);

  // Delete a Tutorial by id
  router.delete("/:id", tutorials.delete);

  // Delete all Tutorials
  router.delete("/", tutorials.deleteAll);

  app.use("/api/tutorials", router);
};
