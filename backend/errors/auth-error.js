class AuthError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AuthFailed';
    this.statusCode = 401;
  }
}

module.exports = AuthError;
