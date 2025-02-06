const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');

const app = express();

// 1) GLobal MIDDLEWARES
// SET security HTTP headers
app.use(helmet());

// Development Logging
// console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  // MIDDLEWARE : Logs the details of the request to the console
  app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});

// Body parser, reading data from the body into req.body
app.use('/api', limiter);

// MIDDLEWARE :  Parses the incoming JSON request body and makes it available as req.body
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize()); // mongoSanitize is a function that we will call which will return a middleware function which we can then use

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  }),
);

// Serving static files
app.use(express.static(`${__dirname}/public`));

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  next();
});

// 3) ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`));
});

// Global error handling Middleware
app.use(globalErrorHandler);

// tourRouter.route('/api/v1/tours').get(getAllTours).post(createTour);
// tourRouter.route('/api/v1/tours/:id').get(getTour).patch(upadatTour).delete(deleteTour)

// userRouter.route('/').get(getAllUsers).post(createUser);
// userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

// const tourRouter = express.Router();
// const userRouter = express.Router();

// 4) START SERVER
// const port = 3000;
// app.listen(port, () => {
//     console.log(`App running on port ${port}...`);
// });

module.exports = app;
