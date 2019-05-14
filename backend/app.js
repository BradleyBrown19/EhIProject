const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

const commentRoutes = require('./routes/comments');
const userRoutes = require('./routes/user');

mongoose.connect("mongodb+srv://Brad:dQG5umBqyypMSrvp@cluster0-k54ab.gcp.mongodb.net/CoolAiProjects?retryWrites=true")
    .then(() => {
        console.log('Connected to database!');
    })
    .catch(() => {
        console.log('Connection failed!');
    });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

app.use((req, res, next) => {
    res.setHeader(
      'Access-Control-Allow-Origin', '*'
    );
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'
    );
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET, POST, PATCH, PUT, DELETE, OPTIONS'
    );
    next();
  });

app.use('/api/comments', commentRoutes);

app.use('/api/user', userRoutes);

module.exports = app;