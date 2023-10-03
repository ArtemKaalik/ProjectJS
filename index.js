require('dotenv').config();
const PORT = process.env.PORT || 3000;
const express = require('express');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/dbConnect');
const mongoose = require('mongoose');
const routes = require('./routes/routesSubscriptions');

connectDB();

const app = express();
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
  }));
app.use(cookieParser());

app.use('/', require('./routes/routes'));

app.use('/api', routes);

app.use('/api', require('./routes/routesUser'));

// app.use('/api', require('./routes/routesProfiles'));

app.use('/api', require('./routes/routesComment'));

app.use('/api', require('./routes/routesArticle'));


mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});

mongoose.connection.on('error', err => {
    console.log(err);
})