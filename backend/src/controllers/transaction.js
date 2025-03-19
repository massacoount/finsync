import express from "express";
export default class TransactionController {
  constructor(logger, dbService, util) {
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
      this.getTransactions.bind(this)
    );
    this.router.post(
      "/",
      this.util.validateRequest(),
      this.createTransaction.bind(this)
    );
    this.router.get(
      "/:id",
      this.util.validateRequest(),
      this.getTransaction.bind(this)
    );
    this.router.put(
      "/:id",
      this.util.validateRequest(),
      this.updateTransaction.bind(this)
    );
    this.router.delete(
      "/:id",
      this.util.validateRequest(),
      this.deleteTransaction.bind(this)
    );
  }

  async getTransactions(req, res) {
    try {
      const transactions = await this.db.query(
        "SELECT * FROM transaction WHERE user_id = ?",
        [req.user.id]
      );
      res.json(transactions);
    } catch (error) {
      this.logger.error("Error fetching transactions:", error);
      res.status(500).json({ error: "Failed to fetch transactions" });
    }
  }

  async createTransaction(req, res) {
    const {
      description,
      amount,
      from_account_id,
      to_account_id,
      category_id,
      tag_id,
    } = req.body;
    const connection = await this.db.getConnection();

    this.logger.info("Starting new transaction", {
      userId: req.user.id,
      fromAccount: from_account_id,
      toAccount: to_account_id,
      amount,
    });

    try {
      await connection.beginTransaction();
      this.logger.debug("Transaction started");
      await connection.query(
        "INSERT INTO transaction (user_id, description, amount, from_account_id, to_account_id, category_id, tag_id, transaction_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          req.user.id,
          description,
          amount,
          from_account_id,
          to_account_id,
          category_id,
          tag_id,
          new Date(),
        ]
      );
      await connection.query(
        "UPDATE account SET current_balance = current_balance - ? WHERE account_id = ?",
        [amount, from_account_id]
      );
      await connection.query(
        "UPDATE account SET current_balance = current_balance + ? WHERE account_id = ?",
        [amount, to_account_id]
      );

      await connection.commit();
      this.logger.info("Transaction completed successfully", {
        transactionId,
        amount,
        fromAccount: from_account_id,
        toAccount: to_account_id,
      });
      res.status(201).json({ id: transactionId, ...req.body });
    } catch (error) {
      await connection.rollback();
      this.logger.error("Transaction failed", {
        error,
        userId: req.user.id,
        fromAccount: from_account_id,
        toAccount: to_account_id,
        amount,
      });
      res.status(400).json({ error: "Failed to create transaction" });
    } finally {
      connection.release();
      this.logger.debug("Database connection released");
    }
  }

  async getTransaction(req, res) {
    try {
      const [transaction] = await this.db.query(
        "SELECT * FROM transaction WHERE transaction_id = ? AND user_id = ?",
        [req.params.id, req.user.id]
      );
      if (transaction) {
        res.json(transaction);
      } else {
        res.status(404).json({ error: "Transaction not found" });
      }
    } catch (error) {
      this.logger.error("Error fetching transaction:", error);
      res.status(500).json({ error: "Failed to fetch transaction" });
    }
  }

  async updateTransaction(req, res) {
    // Updating transactions might require complex logic to handle balance adjustments
    // This is a simplified version
    const { description, category_id, tag_id } = req.body;
    try {
      await this.db.query(
        "UPDATE transaction SET description = ?, category_id = ?, tag_id = ? WHERE transaction_id = ? AND user_id = ?",
        [description, category_id, tag_id, req.params.id, req.user.id]
      );
      res.json({ id: req.params.id, ...req.body });
    } catch (error) {
      this.logger.error("Error updating transaction:", error);
      res.status(400).json({ error: "Failed to update transaction" });
    }
  }

  async deleteTransaction(req, res) {
    // Deleting transactions might require complex logic to handle balance adjustments
    // This is a simplified version
    try {
      await this.db.query(
        "DELETE FROM transaction WHERE transaction_id = ? AND user_id = ?",
        [req.params.id, req.user.id]
      );
      res.status(204).send();
    } catch (error) {
      this.logger.error("Error deleting transaction:", error);
      res.status(400).json({ error: "Failed to delete transaction" });
    }
  }
}
