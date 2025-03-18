class AuthController {
  constructor(logger, dbService, util, oauthService) {
    this.logger = logger;
    this.db = dbService;
    this.util = util;
    this.oauthService = oauthService;
    this.router = express.Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get("/authorize", this.authorize.bind(this));
    this.router.post("/token", this.token.bind(this));
    this.router.get(
      "/userinfo",
      this.oauthService.authenticateRequest(),
      this.userInfo.bind(this)
    );
  }

  async authorize(req, res) {
    await this.oauthService.authorizeHandler(req, res);
  }

  async token(req, res) {
    await this.oauthService.tokenHandler(req, res);
  }

  async userInfo(req, res) {
    const [user] = await this.db.query(
      "SELECT id, name, email FROM user WHERE id = ?",
      [req.user.id]
    );
    res.json({
      sub: user.id,
      name: user.name,
      email: user.email,
      email_verified: true,
    });
  }
}

module.exports = AuthController;
