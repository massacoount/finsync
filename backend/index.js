const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const swaggerUi = require("swagger-ui-express");
const specs = require('./doc');
const bcrypt = require('bcrypt');
const app = express();
app.use(bodyParser.json());
require('dotenv').config()

// JWT secret keys (use environment variables in production)
const JWT_SECRET = process.env.FINSYNC_JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.FINSYNC_JWT_REFRESH_SECRET;

const connection = mysql.createConnection({
  port: process.env.FINSYNC_DB_PORT.trim(),
  host: process.env.FINSYNC_DB_HOST.trim(),
  user: process.env.FINSYNC_DB_USER.trim(),
  password: process.env.FINSYNC_DB_PASSWORD.trim(),
  database: process.env.FINSYNC_DB_NAME.trim(),
});

connection.connect((err) => {
  if (err) {
    console.error({
      port: process.env.FINSYNC_DB_PORT.trim(),
      host: process.env.FINSYNC_DB_HOST.trim(),
      user: process.env.FINSYNC_DB_USER.trim(),
      password: process.env.FINSYNC_DB_PASSWORD.trim(),
      database: process.env.FINSYNC_DB_NAME.trim(),
    });
    console.error("Error connecting to MySQL: ", err);
    process.exit(1);
  }
  console.log("Connected to MySQL.");
});

/*
  ---------------------------
  Validation Middleware Example
  ---------------------------
*/
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  // Expecting header "Authorization: Bearer <token>"
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Access token required" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid or expired token" });
    req.user = user;
    next();
  });
}

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

/*
  ---------------------------
  CRUD Endpoints
  ---------------------------
*/

// ===== User Endpoints =====

// User validation middleware
const validateUser = [
  body('email').isEmail().normalizeEmail().withMessage('Invalid email address'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/\d/)
    .withMessage('Password must contain a number')
    .matches(/[A-Z]/)
    .withMessage('Password must contain an uppercase letter'),
  body('name').trim().notEmpty().withMessage('Name is required'),
];

// Create a new user
app.post("/users", validateUser, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, name } = req.body;
    const id = uuidv4();
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const query = 'INSERT INTO users (id, email, password, name) VALUES (?, ?, ?, ?)';
    connection.query(query, [id, email, hashedPassword, name], (err) => {
      if (err) {
        console.error('Error creating user: ', err);
        return res.status(500).json({ error: 'Database error' });
      }
      // Return user without password
      res.status(201).json({ id, email, name });
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Read all users
app.get("/users", authenticateToken, (req, res) => {
  connection.query('SELECT id, email, name FROM users', (err, results) => {
    if (err) {
      console.error('Error fetching users: ', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

// Read a single user
app.get("/users/:id", authenticateToken, (req, res) => {
  connection.query('SELECT id, email, name FROM users WHERE id = ?', [req.params.id], (err, results) => {
    if (err) {
      console.error('Error fetching user: ', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (!results.length) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(results[0]);
  });
});

// Update user
app.put('/users/:id', authenticateToken, validateUser, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, name } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const query = 'UPDATE users SET email = ?, password = ?, name = ? WHERE id = ?';
    connection.query(query, [email, hashedPassword, name, req.params.id], (err) => {
      if (err) {
        console.error('Error updating user: ', err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ message: 'User updated' });
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete user
app.delete("/users/:id", authenticateToken, (req, res) => {
  connection.query("DELETE FROM users WHERE id = ?", [req.params.id], (err) => {
    if (err) {
      console.error("Error deleting user: ", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json({ message: "User deleted" });
  });
});

// ===== Categories Endpoints =====
app.post("/categories", authenticateToken, (req, res) => {
  const { name, type, notes } = req.body;
  const id = uuidv4();
  const query =
    "INSERT INTO categories (id, name, type, notes) VALUES (?, ?, ?, ?)";
  connection.query(query, [id, name, type, notes], (err) => {
    if (err) {
      console.error("Error creating category: ", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.status(201).json({ id, name, type, notes });
  });
});

app.get("/categories", authenticateToken, (req, res) => {
  connection.query("SELECT * FROM categories", (err, results) => {
    if (err) {
      console.error("Error fetching categories: ", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

app.get("/categories/:id", authenticateToken, (req, res) => {
  connection.query(
    "SELECT * FROM categories WHERE id = ?",
    [req.params.id],
    (err, results) => {
      if (err) {
        console.error("Error fetching category: ", err);
        return res.status(500).json({ error: "Database error" });
      }
      if (!results.length) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json(results[0]);
    }
  );
});

app.put("/categories/:id", authenticateToken, (req, res) => {
  const { name, type, notes } = req.body;
  const query =
    "UPDATE categories SET name = ?, type = ?, notes = ? WHERE id = ?";
  connection.query(query, [name, type, notes, req.params.id], (err) => {
    if (err) {
      console.error("Error updating category: ", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json({ message: "Category updated" });
  });
});

app.delete("/categories/:id", authenticateToken, (req, res) => {
  connection.query(
    "DELETE FROM categories WHERE id = ?",
    [req.params.id],
    (err) => {
      if (err) {
        console.error("Error deleting category: ", err);
        return res.status(500).json({ error: "Database error" });
      }
      res.json({ message: "Category deleted" });
    }
  );
});

// ===== Accounts Endpoints =====
app.post("/accounts", authenticateToken, (req, res) => {
  const { name, account_type, description } = req.body;
  const id = uuidv4();
  const query =
    "INSERT INTO accounts (id, name, account_type, description) VALUES (?, ?, ?, ?)";
  connection.query(query, [id, name, account_type, description], (err) => {
    if (err) {
      console.error("Error creating account: ", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.status(201).json({ id, name, account_type, description });
  });
});

app.get("/accounts", authenticateToken, (req, res) => {
  connection.query("SELECT * FROM accounts", (err, results) => {
    if (err) {
      console.error("Error fetching accounts: ", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

app.get("/accounts/:id", authenticateToken, (req, res) => {
  connection.query(
    "SELECT * FROM accounts WHERE id = ?",
    [req.params.id],
    (err, results) => {
      if (err) {
        console.error("Error fetching account: ", err);
        return res.status(500).json({ error: "Database error" });
      }
      if (!results.length) {
        return res.status(404).json({ message: "Account not found" });
      }
      res.json(results[0]);
    }
  );
});

app.put("/accounts/:id", authenticateToken, (req, res) => {
  const { name, account_type, description } = req.body;
  const query =
    "UPDATE accounts SET name = ?, account_type = ?, description = ? WHERE id = ?";
  connection.query(
    query,
    [name, account_type, description, req.params.id],
    (err) => {
      if (err) {
        console.error("Error updating account: ", err);
        return res.status(500).json({ error: "Database error" });
      }
      res.json({ message: "Account updated" });
    }
  );
});

app.delete("/accounts/:id", authenticateToken, (req, res) => {
  connection.query(
    "DELETE FROM accounts WHERE id = ?",
    [req.params.id],
    (err) => {
      if (err) {
        console.error("Error deleting account: ", err);
        return res.status(500).json({ error: "Database error" });
      }
      res.json({ message: "Account deleted" });
    }
  );
});

// ===== Transaction Endpoints =====
app.post("/transactions", authenticateToken, (req, res) => {
  const { date, amount, description, user_id, category_id, account_id } =
    req.body;
  const id = uuidv4();
  const query =
    "INSERT INTO transactions (id, date, amount, description, user_id, category_id, account_id) VALUES (?, ?, ?, ?, ?, ?, ?)";
  connection.query(
    query,
    [id, date, amount, description, user_id, category_id, account_id],
    (err) => {
      if (err) {
        console.error("Error creating transaction: ", err);
        return res.status(500).json({ error: "Database error" });
      }
      res
        .status(201)
        .json({
          id,
          date,
          amount,
          description,
          user_id,
          category_id,
          account_id,
        });
    }
  );
});

app.get("/transactions", authenticateToken, (req, res) => {
  connection.query("SELECT * FROM transactions", (err, results) => {
    if (err) {
      console.error("Error fetching transactions: ", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

app.get("/transactions/:id", authenticateToken, (req, res) => {
  connection.query(
    "SELECT * FROM transactions WHERE id = ?",
    [req.params.id],
    (err, results) => {
      if (err) {
        console.error("Error fetching transaction: ", err);
        return res.status(500).json({ error: "Database error" });
      }
      if (!results.length) {
        return res.status(404).json({ message: "Transaction not found" });
      }
      res.json(results[0]);
    }
  );
});

app.put("/transactions/:id", authenticateToken, (req, res) => {
  const { date, amount, description, user_id, category_id, account_id } =
    req.body;
  const query =
    "UPDATE transactions SET date = ?, amount = ?, description = ?, user_id = ?, category_id = ?, account_id = ? WHERE id = ?";
  connection.query(
    query,
    [
      date,
      amount,
      description,
      user_id,
      category_id,
      account_id,
      req.params.id,
    ],
    (err) => {
      if (err) {
        console.error("Error updating transaction: ", err);
        return res.status(500).json({ error: "Database error" });
      }
      res.json({ message: "Transaction updated" });
    }
  );
});

app.delete("/transactions/:id", authenticateToken, (req, res) => {
  connection.query(
    "DELETE FROM transactions WHERE id = ?",
    [req.params.id],
    (err) => {
      if (err) {
        console.error("Error deleting transaction: ", err);
        return res.status(500).json({ error: "Database error" });
      }
      res.json({ message: "Transaction deleted" });
    }
  );
});

// ===== Journal Endpoints =====
app.post("/journals", authenticateToken, (req, res) => {
  const { date, journal_entry, transaction_id } = req.body;
  const id = uuidv4();
  const query =
    "INSERT INTO journals (id, date, journal_entry, transaction_id) VALUES (?, ?, ?, ?)";
  connection.query(query, [id, date, journal_entry, transaction_id], (err) => {
    if (err) {
      console.error("Error creating journal entry: ", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.status(201).json({ id, date, journal_entry, transaction_id });
  });
});

app.get("/journals", authenticateToken, (req, res) => {
  connection.query("SELECT * FROM journals", (err, results) => {
    if (err) {
      console.error("Error fetching journals: ", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

app.get("/journals/:id", authenticateToken, (req, res) => {
  connection.query(
    "SELECT * FROM journals WHERE id = ?",
    [req.params.id],
    (err, results) => {
      if (err) {
        console.error("Error fetching journal: ", err);
        return res.status(500).json({ error: "Database error" });
      }
      if (!results.length) {
        return res.status(404).json({ message: "Journal not found" });
      }
      res.json(results[0]);
    }
  );
});

app.put("/journals/:id", authenticateToken, (req, res) => {
  const { date, journal_entry, transaction_id } = req.body;
  const query =
    "UPDATE journals SET date = ?, journal_entry = ?, transaction_id = ? WHERE id = ?";
  connection.query(
    query,
    [date, journal_entry, transaction_id, req.params.id],
    (err) => {
      if (err) {
        console.error("Error updating journal: ", err);
        return res.status(500).json({ error: "Database error" });
      }
      res.json({ message: "Journal updated" });
    }
  );
});

app.delete("/journals/:id", authenticateToken, (req, res) => {
  connection.query(
    "DELETE FROM journals WHERE id = ?",
    [req.params.id],
    (err) => {
      if (err) {
        console.error("Error deleting journal: ", err);
        return res.status(500).json({ error: "Database error" });
      }
      res.json({ message: "Journal deleted" });
    }
  );
});

// ===== BudgetTargets Endpoints =====
app.post("/budget-targets", authenticateToken, (req, res) => {
  const { category_id, monthly_target, notes } = req.body;
  const id = uuidv4();
  const query =
    "INSERT INTO budget_targets (id, category_id, monthly_target, notes) VALUES (?, ?, ?, ?)";
  connection.query(query, [id, category_id, monthly_target, notes], (err) => {
    if (err) {
      console.error("Error creating budget target: ", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.status(201).json({ id, category_id, monthly_target, notes });
  });
});

app.get("/budget-targets", authenticateToken, (req, res) => {
  connection.query("SELECT * FROM budget_targets", (err, results) => {
    if (err) {
      console.error("Error fetching budget targets: ", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

app.get("/budget-targets/:id", authenticateToken, (req, res) => {
  connection.query(
    "SELECT * FROM budget_targets WHERE id = ?",
    [req.params.id],
    (err, results) => {
      if (err) {
        console.error("Error fetching budget target: ", err);
        return res.status(500).json({ error: "Database error" });
      }
      if (!results.length) {
        return res.status(404).json({ message: "Budget target not found" });
      }
      res.json(results[0]);
    }
  );
});

app.put("/budget-targets/:id", authenticateToken, (req, res) => {
  const { category_id, monthly_target, notes } = req.body;
  const query =
    "UPDATE budget_targets SET category_id = ?, monthly_target = ?, notes = ? WHERE id = ?";
  connection.query(
    query,
    [category_id, monthly_target, notes, req.params.id],
    (err) => {
      if (err) {
        console.error("Error updating budget target: ", err);
        return res.status(500).json({ error: "Database error" });
      }
      res.json({ message: "Budget target updated" });
    }
  );
});

app.delete("/budget-targets/:id", authenticateToken, (req, res) => {
  connection.query(
    "DELETE FROM budget_targets WHERE id = ?",
    [req.params.id],
    (err) => {
      if (err) {
        console.error("Error deleting budget target: ", err);
        return res.status(500).json({ error: "Database error" });
      }
      res.json({ message: "Budget target deleted" });
    }
  );
});

/*
  ---------------------------
  JWT OAuth Token Endpoints (Password Grant Type)
  ---------------------------
*/

app.post(
  "/auth/token",
  [body("email").isEmail(), body("password").notEmpty()],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;
      const query = 'SELECT * FROM users WHERE email = ?';
      
      connection.query(query, [email], async (err, results) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Database error' });
        }
        
        if (!results.length) {
          return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const user = results[0];
        const validPassword = await bcrypt.compare(password, user.password);
        
        if (!validPassword) {
          return res.status(401).json({ error: 'Invalid credentials' });
        }

        const accessToken = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '15m' });
        const refreshToken = jwt.sign({ userId: user.id }, JWT_REFRESH_SECRET, { expiresIn: '7d' });
        
        res.json({ accessToken, refreshToken });
      });
    } catch (error) {
      console.error('Authentication error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

app.post("/auth/refresh", [body("refreshToken").notEmpty()], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { refreshToken } = req.body;
  try {
    const payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    // Generate a new access token
    const newAccessToken = jwt.sign({ userId: payload.userId }, JWT_SECRET, {
      expiresIn: "15m",
    });
    res.json({ accessToken: newAccessToken });
  } catch (err) {
    console.error("Refresh token error:", err);
    res.status(401).json({ error: "Invalid refresh token" });
  }
});

/*
  ---------------------------
  Start the Server
  ---------------------------
*/
const PORT = process.env.FINSYNC_PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
