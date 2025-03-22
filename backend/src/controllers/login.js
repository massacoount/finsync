// loginController.js
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export default class LoginController {
  constructor(logger, dbService) {
    this.logger = logger;
    this.db = dbService;
    this.router = express.Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    // Custom login endpoint that does NOT use OAuth's password grant type
    this.router.get("", (req, res) => {
      res.send(__dirname + "/../public/Login.html");
    });
    this.router.post("", this.login.bind(this));
  }

  async login(req, res) {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res
          .status(400)
          .json({ error: "Username and password required" });
      }

      // Query the database for the user record by email (username)
      const [user] = await this.db.query("SELECT * FROM user WHERE email = ?", [
        username,
      ]);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Verify the supplied password against the stored bcrypt hash
      const isMatch = await bcrypt.compare(password, user.hash);
      if (!isMatch) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Prepare the JWT payload with user information
      const payload = {
        id: user.id,
        name: user.name,
        email: user.email,
      };

      const token = jwt.sign(payload, process.env.FINSYNC_JWT_SECRET, {
        expiresIn: "1h",
      });

      // Set the token as an HTTP-only, secure cookieoken as an HTTP-only, secure cookie
      res.cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Use secure cookies in production.NODE_ENV === "production", // Use secure cookies in production
        sameSite: "strict", // Prevent CSRF
        maxAge: 3600 * 1000, // 1 hour in milliseconds
      });

      res.json({
        message: "Login successful",
      });
      
    } catch (error) {
      this.logger.error("Login error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
