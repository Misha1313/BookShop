const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bookRoutes = require('./routes/book');
const authRoutes = require('./routes/auth');
const mongodbConString = process.env.MONGODB_CONNECTION_STRING || 'mongodb+srv://user:Mixeil123@cluster0.b2wq99i.mongodb.net/BookShop';
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger_output.json');
const generateDocs = require('./swagger');

mongoose.set('strictQuery', false);

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
    console.log('1');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Methods',
      'OPTIONS, GET, POST, PUT, PATCH, DELETE'
    );
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });

app.use(bookRoutes);
app.use(authRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res
        .status(status)
        .json({
            message: message,
            data: data
        })
})

mongoose
    .connect(mongodbConString)
    .then(res => {
        return generateDocs();
    })
    .then(res => {
        app.listen(process.env.PORT || 3000);
    })
    .catch(err => {
        console.log(err);
    })


