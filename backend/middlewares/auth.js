const jwt = require('jsonwebtoken');
const AuthError = require('../errors/auth-error');

const JWT_SECRET = process.env.JWT_SECRET;

const auth = (req, res, next) => {
  const { cookies } = req;

  if (!cookies) {
    throw new AuthError('Авторизация не успешна');
    // next(res.status(ERROR_AUTH).send({ error: 'Авторизация не успешна' }));
  } else {
    const token = cookies.jwt;
    let payload;

    // попытаемся верифицировать токен
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      // next(res.status(ERROR_AUTH).send({ error: 'jwt token is not valid' }));
      return next(new AuthError('jwt token is not valid'));
    }
    req.user = payload;
    return next();
  }
};

module.exports = auth;
