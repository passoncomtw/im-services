/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express from 'express';
import morgan from 'morgan';
import cors from 'cors'
import passport from 'passport';
import cookieParser from 'cookie-parser';
import swagger from 'express-swagger-generator';

const { join } = require('path');
const indexRouter = require("./controllers/index");
const authRouter = require("./controllers/authRouter");
const homeRouter = require("./controllers/homeRouter");
const userRouter = require("./controllers/userRouter");
const packageJson = require('../../../package.json');

const { NODE_ENV = "development", APP_DOMAIN } = process.env;

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'Demo-backend-api',
      description: 'Demo backend api service.',
      version: `${packageJson.version} - ${NODE_ENV}`,
    },
    host: APP_DOMAIN,
    produces: ['application/json'],
    schemes: ['http', 'https'],
    securityDefinitions: {
      JWT: {
        type: 'apiKey',
        in: 'header',
        name: 'Authorization',
        description: 'JWT token',
      },
    },
  },
  route: {
    url: '/api-docs',
    docs: '/api-docs.json',
  },
  basedir: './apps/im-ws-api',
  files: ['./apps/im-ws-api/src/controllers/*.js'],
};

let expressApp = express();
if (NODE_ENV === "dev") {
  // Log every HTTP request. See https://github.com/expressjs/morgan for other
  // available formats.
  expressApp.use(morgan("dev"));
}

expressApp.use(cors());
expressApp.use(express.json());
expressApp.use(express.urlencoded({ extended: false }));
expressApp.use(cookieParser());

expressApp.use(passport.initialize());

expressApp.use('/', indexRouter);
expressApp.use('/auth', authRouter);
expressApp.use('/users', passport.authenticate('jwt', { session: false }), userRouter);
expressApp.use('/home', homeRouter);

// Add GET /health-check express route
expressApp.get("/health-check", (req, res) => {
  res.json({
    success: true,
    data: { status: 'WORKING' }
  });
});

swagger(expressApp)(swaggerOptions);

// const app = express();

// app.get('/api', (req, res) => {
//   res.send({ message: 'Welcome to im-ws-api!' });
// });

const port = process.env.PORT || 3333;
const server = expressApp.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
