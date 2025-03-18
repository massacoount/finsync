class AccountController {
  constructor(logger, db, util) {
    this.logger = logger;
    this.db = dbService;
    this.util = util;
    this.router = express.Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get(
      "/",
      this.util.validateRequest(),
      this.getAccounts.bind(this)
    );
    this.router.post(
      "/",
      this.util.validateRequest(),
      this.createAccount.bind(this)
    );
    this.router.get(
      "/:id",
      this.util.validateRequest(),
      this.getAccount.bind(this)
    );
    this.router.put(
      "/:id",
      this.util.validateRequest(),
      this.updateAccount.bind(this)
    );
    this.router.delete(
      "/:id",
      this.util.validateRequest(),
      this.deleteAccount.bind(this)
    );
  }

  async getAccounts(req, res) {
    try {
      const accounts = await this.db.query(
        "SELECT * FROM account WHERE user_id = ?",
        [req.user.id]
      );
      res.json(accounts);
    } catch (error) {
      this.logger.log("error", "Error fetching accounts:", error);
      res.status(500).json({ error: "Failed to fetch accounts" });
    }
  }

  async createAccount(req, res) {
    const { account_name, opening_balance, account_type } = req.body;
    try {
      await this.db.query(
        "INSERT INTO account (user_id, account_name, opening_balance, current_balance, account_type, opening_date) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [
          req.user.id,
          account_name,
          opening_balance,
          opening_balance,
          account_type,
          new Date(),
        ]
      );
      res.status(201).json({ id: accountId, ...req.body });
    } catch (error) {
      this.logger.log("error", "Error creating account:", error);
      res.status(400).json({ error: "Failed to create account" });
    }
  }

  async getAccount(req, res) {
    try {
      const [account] = await this.db.query(
        "SELECT * FROM account WHERE account_id = ? AND user_id = ?",
        [req.params.id, req.user.id]
      );
      if (account) {
        res.json(account);
      } else {
        res.status(404).json({ error: "Account not found" });
      }
    } catch (error) {
      this.logger.log("error", "Error fetching account:", error);
      res.status(500).json({ error: "Failed to fetch account" });
    }
  }

  async updateAccount(req, res) {
    const { account_name, account_type } = req.body;
    try {
      await this.db.query(
        "UPDATE account SET account_name = ?, account_type = ? WHERE account_id = ? AND user_id = ?",
        [account_name, account_type, req.params.id, req.user.id]
      );
      res.json({ id: req.params.id, ...req.body });
    } catch (error) {
      this.logger.log("error", "Error updating account:", error);
      res.status(400).json({ error: "Failed to update account" });
    }
  }

  async deleteAccount(req, res) {
    try {
      await this.db.query(
        "DELETE FROM account WHERE account_id = ? AND user_id = ?",
        [req.params.id, req.user.id]
      );
      res.status(204).send();
    } catch (error) {
      this.logger.log("error", "Error deleting account:", error);
      res.status(400).json({ error: "Failed to delete account" });
    }
  }
}
module.exports = AccountController;
