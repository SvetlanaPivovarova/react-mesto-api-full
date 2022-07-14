const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { celebrate, Joi, errors } = require('celebrate');
const dotenv = require('dotenv');

const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const NotFoundError = require('./errors/not-found-error');
const errorsHandler = require('./errors/error-handler');
const cors = require('./middlewares/cors');

dotenv.config();

// Слушаем 3000 порт
const { PORT = 3000 } = process.env;

const app = express();

app.use(cors);

app.use(bodyParser.json()); // для собирания JSON-формата
app.use(bodyParser.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса
app.use(cookieParser()); // подключаем парсер cookie

app.use(requestLogger); // подключаем логгер запросов

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

// роуты, не требующие авторизации
app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().pattern(/^https?:\/\/(www\.)?[a-zA-Z\0-9]+\.[\w\d\-._~:?#[\]@!$&'()*+,;=]{2,}#?/),
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  createUser,
);
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

// авторизация
app.use(auth);

// роуты, которым авторизация нужна
app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.use((req, res, next) => next(new NotFoundError('Запрашиваемая страница не найдена')));

app.use(errorLogger); // подключаем логгер ошибок

// обработчики ошибок
app.use(errors()); // обработчик ошибок celebrate

// централизованная обработка ошибок
app.use(errorsHandler);

app.listen(PORT, async () => {
  // подключаемся к серверу mongo
  mongoose.connection.on('connected', () => {
    // console.log('mongodb connected!!!');
  });
  await mongoose.connect(
    'mongodb://localhost:27017/mestodb',
  );
  // console.log(`App listening on port ${PORT}`);
});
