const express = require('express');
const morgan = require('morgan');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  // MIDDLEWARE : Logs the details of the request to the console
  app.use(morgan('dev'));
}

// MIDDLEWARE :  Parses the incoming JSON request body and makes it available as req.body
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  next();
});

// 3) ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

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
