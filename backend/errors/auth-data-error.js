class AuthDataError extends Error {
  constructor(message) {
    super(message);
    this.name = 'UserAlreadyExists';
    this.statusCode = 409;
  }
}

module.exports = AuthDataError;
