import express from "express";

export default class TagController {
  constructor(logger, dbService, util) {
    this.logger = logger;
    this.db = dbService;
    this.util = util;
    this.router = express.Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get("/", this.util.validateRequest(), this.getTags.bind(this));
    this.router.post(
      "/",
      this.util.validateRequest(),
      this.createTag.bind(this)
    );
    this.router.put(
      "/:id",
      this.util.validateRequest(),
      this.updateTag.bind(this)
    );
    this.router.delete(
      "/:id",
      this.util.validateRequest(),
      this.deleteTag.bind(this)
    );
  }

  async getTags(req, res) {
    try {
      const tags = await this.db.query("SELECT * FROM tag WHERE user_id = ?", [
        req.user.id,
      ]);
      res.json(tags);
    } catch (error) {
      this.logger.error("Error fetching tags:", error);
      res.status(500).json({ error: "Failed to fetch tags" });
    }
  }

  async createTag(req, res) {
    const { tag_name } = req.body;
    try {
      await this.db.query(
        "INSERT INTO tag (user_id, tag_name) VALUES (?, ?, ?)",
        [req.user.id, tag_name]
      );
      res.status(201).json({ id: tagId, tag_name });
    } catch (error) {
      this.logger.error("Error creating tag:", error);
      res.status(400).json({ error: "Failed to create tag" });
    }
  }

  async updateTag(req, res) {
    const { tag_name } = req.body;
    try {
      await this.db.query(
        "UPDATE tag SET tag_name = ? WHERE tag_id = ? AND user_id = ?",
        [tag_name, req.params.id, req.user.id]
      );
      res.json({ id: req.params.id, tag_name });
    } catch (error) {
      this.logger.error("Error updating tag:", error);
      res.status(400).json({ error: "Failed to update tag" });
    }
  }

  async deleteTag(req, res) {
    try {
      await this.db.query("DELETE FROM tag WHERE tag_id = ? AND user_id = ?", [
        req.params.id,
        req.user.id,
      ]);
      res.status(204).send();
    } catch (error) {
      this.logger.error("Error deleting tag:", error);
      res.status(400).json({ error: "Failed to delete tag" });
    }
  }
}
