const express = require('express');
const morgan = require('morgan')

const tourRouter = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes')

const app = express();

// console.log(process.env.NODE_ENV);
if(process.env.NODE_ENV === 'development') {
    // MIDDLEWARE : Logs the details of the request to the console
    app.use(morgan('dev'))
}


// MIDDLEWARE :  Parses the incoming JSON request body and makes it available as req.body
app.use(express.json())

app.use(express.static(`${__dirname}/public`));

// Custom Middleware
app.use((req, res, next) =>{
    console.log('Hello from the middleware!');
    next();
})

// Request Time Middlewar :  Adds a requestTime property to the req object, containing the current timestamp.
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
})

// app.get('/', (req, res) => {
//     res.status(200).json({message: "Hello from the server side!", app: "natours"})
// });

// app.post("/", (req, res) => {
//     res.send("You can post to this endpoint...");
// });

// const tours = JSON.parse(
//     fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
// );


//  2) ROUTE HANDLERS
/////////////////////////////////////////////////////////
// const getAllTours = (req, res) => {
//     console.log(req.requestTime);
//     res.status(200).json({
//         status: 'success',
//         requestedAt : req.requestTime,
//         results: tours.length,
//         data : {
//             tours
//         }
//     })
// }

//////////////////////////////////////////////////////////////
// const getTour = (req, res) => {
//     console.log(req.params); 
//     const id = req.params.id * 1;
//     // if (id > tours.length) {
//     //     return res.status(404).json({
//     //         status : 'fail',
//     //         message : 'Invalid Id'
//     //     })
//     // }
//     const tour = tours.find(el => el.id === id);

//     if (!tour) {
//         return res.status(404).json({
//             status : 'fail',
//             message : 'Invalid Id'
//         })
//     }
//     res.status(200).json({
//         status:'success',
//         data : {
//             tour
//         }
//     })
// }

///////////////////////////////////////////////////////////////////
// const createTour = (req, res) => {
//     const newId = tours[tours.length - 1].id + 1;
//     const newTour = Object.assign({ id : newId }, req.body);

//     tours.push(newTour);
//     fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
//         res.status(201).json({
//             status: 'success',
//             data: {
//                 tour: newTour
//             }
//         })
//     })
//     // console.log(req.body)
//     // res.send("Done")
// }

///////////////////////////////////////////////////////////////////
// const upadatTour = (req, res) => {
//     if(req.params.id * 1 > tours.length){
//         return res.status(404).json({
//             status : 'fail',
//             message : 'Invalid ID'
//         })
//     }

//     res.status(200).json({
//         status : "success",
//         data: {
//             tour: '<Updated tour here...>'
//         }
//     })
// }

//////////////////////////////////////////////////////////////////////
// const deleteTour = (req, res) => {
//     if (req.params.id * 1 > tours.length) {
//         return res.status(404).json({
//             status : 'fail',
//             message: 'Invalid ID'
//         })
//     }

//     res.status(204).json({
//         status : 'success',
//         data : null
//     })
// }

//////////////////////////////////////////////////////////////////////////
// users Route Handler


// const getAllUsers = (req, res) => {
//     res.status(500).json({
//         status : 'error',
//         message : 'This route is not yet defined!'
//     })
// }


// const createUser = (req, res) => {
//     res.status(500).json({
//         status : 'error',
//         message : 'This route is not yet defined!'
//     })
// }

// const getUser = (req, res) => {
//     res.status(500).json({
//         status : 'error',
//         message : 'This route is not yet defined!'
//     })
// }

// const updateUser = (req, res) => {
//     res.status(500).json({
//         status : 'error',
//         message : 'This route is not yet defined!'
//     })
// }

// const deleteUser = (req, res) => {
//     res.status(500).json({
//         status : 'error',
//         message : 'This route is not yet defined!'
//     })
// }


// app.get('/api/v1/tours', getAllTours)
// app.get('/api/v1/tours/:id', getTour)
// app.post('/api/v1/tours', createTour)
// app.patch('/api/v1/tours/:id', upadatTour)
// app.delete('/api/v1/tours/:id', deleteTour)


// 3) ROUTES
// app.route('/api/v1/tours').get(getAllTours).post(createTour);
// app.route('/api/v1/tours/:id').get(getTour).patch(upadatTour).delete(deleteTour)


// app.route('/api/v1/users').get(getAllUsers).post(createUser);
// app.route('/api/v1/users/:id').get(getUser).patch(updateUser).delete(deleteUser);

app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)

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
