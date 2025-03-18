const crypto = require("crypto");
const OAuth2Server = require("oauth2-server");
const bcrypt = require("bcrypt");

class OAuthService {
  constructor(logger, dbService) {
    this.logger = logger;
    this.db = dbService;
    this.oauth = new OAuth2Server({
      model: this,
      grants: ["authorization_code", "refresh_token", "password"],
      accessTokenLifetime: 3600, // 1 hour
      allowBearerTokensInQueryString: false,
    });
  }

  async getClient(clientId, clientSecret) {
    const [client] = await this.db.query(
      "SELECT * FROM oauth_client WHERE client_id = ? AND client_secret = ?",
      [clientId, clientSecret]
    );
    if (!client) return null;
    return {
      id: client.client_id,
      grants: JSON.parse(client.allowed_grants),
      redirectUris: [client.redirect_uri],
    };
  }

  async getUser(username, password) {
    const [user] = await this.db.query("SELECT * FROM user WHERE email = ?", [
      username,
    ]);
    if (!user || !(await bcrypt.compare(password, user.hash))) {
      return null;
    }
    return { id: user.id };
  }

  async saveToken(token, client, user) {
    await this.db.query(
      "INSERT INTO oauth_token (access_token, access_token_expires, client_id, user_id, refresh_token, scope) VALUES (?, ?, ?, ?, ?, ?)",
      [
        token.accessToken,
        token.accessTokenExpiresAt,
        client.id,
        user.id,
        token.refreshToken,
        token.scope,
      ]
    );
    return { ...token, client, user };
  }

  async getAccessToken(accessToken) {
    const [token] = await this.db.query(
      `SELECT t.*, u.* FROM oauth_token t 
         JOIN user u ON t.user_id = u.id 
         WHERE access_token = ? AND access_token_expires > NOW()`,
      [accessToken]
    );
    if (!token) return null;
    return {
      accessToken: token.access_token,
      accessTokenExpiresAt: token.access_token_expires,
      scope: token.scope,
      user: { id: token.user_id },
      client: { id: token.client_id },
    };
  }

  async getAuthorizationCode(authorizationCode) {
    const [code] = await this.db.query(
      "SELECT * FROM oauth_code WHERE code = ? AND expires > NOW()",
      [authorizationCode]
    );
    if (!code) return null;
    return {
      code: code.code,
      expiresAt: code.expires,
      redirectUri: code.redirect_uri,
      scope: code.scope,
      client: { id: code.client_id },
      user: { id: code.user_id },
    };
  }

  async saveAuthorizationCode(code, client, user) {
    const authCode = {
      code: code.authorizationCode,
      expires: code.expiresAt,
      redirect_uri: code.redirectUri,
      scope: code.scope,
      client_id: client.id,
      user_id: user.id,
    };

    await this.db.query("INSERT INTO oauth_code SET ?", authCode);
    return { ...code, client, user };
  }

  async revokeAuthorizationCode(code) {
    await this.db.query("DELETE FROM oauth_code WHERE code = ?", [code.code]);
    return true;
  }

  async validateScope(user, client, scope) {
    this.logger.info("Validating scope", { user, client, scope });
    if (!scope) return "";
    const requestedScopes = scope.split(" ");
    const [allowedScopes] = await this.db.query(
      "SELECT allowed_scopes FROM oauth_client WHERE client_id = ?",
      [client.id]
    );
    if (!allowedScopes || !allowedScopes.allowed_scopes) return "";
    const validScopes = requestedScopes.filter((s) =>
      allowedScopes.allowed_scopes.includes(s)
    );
    return validScopes.join(" ");
  }

  async verifyScope(token, scope) {
    if (!token.scope) return false;
    const requestedScopes = scope.split(" ");
    const tokenScopes = token.scope.split(" ");
    return requestedScopes.every((s) => tokenScopes.includes(s));
  }

  async handlePasswordGrant(req, res) {
    const { username, password, client_id, client_secret, scope } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "invalid_request" });
    }

    const client = await this.getClient(client_id, client_secret);
    if (!client || !client.grants.includes("password")) {
      return res.status(401).json({ error: "invalid_client" });
    }

    const user = await this.getUser(username, password);
    if (!user) {
      return res.status(401).json({ error: "invalid_grant" });
    }

    const validScope = await this.validateScope(user, client, scope);
    const token = await this.generateToken(client, user, validScope);

    res.set(
      "X-OAuth-Warning",
      "Password grant is deprecated - prefer Authorization Code Flow with PKCE"
    );
    res.json(token);
  }

  async generateToken(client, user, scope) {
    const accessToken = crypto.randomBytes(32).toString("hex");
    const refreshToken = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 3600 * 1000);

    await this.saveToken(
      {
        accessToken,
        accessTokenExpiresAt: expiresAt,
        refreshToken,
        scope,
      },
      client,
      user
    );

    return {
      access_token: accessToken,
      token_type: "Bearer",
      expires_in: 3600,
      refresh_token: refreshToken,
      scope,
    };
  }

  async tokenHandler(req, res) {
    const request = new OAuth2Server.Request(req);
    const response = new OAuth2Server.Response(res);

    try {
      if (request.body.grant_type === "password") {
        return this.handlePasswordGrant(req, res);
      }

      const token = await this.oauth.token(request, response);
      res.json(token);
    } catch (err) {
      this.logger.error("Token error:", err);
      res.status(err.code || 500).json(this.formatOAuthError(err));
    }
  }

  async authorizeHandler(req, res) {
    const request = new OAuth2Server.Request(req);
    const response = new OAuth2Server.Response(res);

    try {
      const authParams = await this.oauth.authorize(request, response);
      res.redirect(
        `${authParams.redirectUri}?code=${authParams.authorizationCode}`
      );
    } catch (err) {
      this.logger.error("Authorization error:", err);
      res.status(err.code || 500).json(this.formatOAuthError(err));
    }
  }

  formatOAuthError(error) {
    return {
      error: error.name,
      error_description: error.message,
    };
  }

  authenticateRequest() {
    return async (req, res, next) => {
      const authHeader = req.headers["authorization"];
      const token = authHeader && authHeader.split(" ")[1];

      if (!token) return res.status(401).json({ error: "invalid_token" });

      try {
        const request = new OAuth2Server.Request(req);
        const response = new OAuth2Server.Response(res);
        const tokenData = await this.oauth.authenticate(request, response);
        req.user = tokenData.user;
        next();
      } catch (err) {
        this.logger.error("Authentication error:", err);
        res.status(401).json(this.formatOAuthError(err));
      }
    };
  }
}
module.exports = OAuthService;
