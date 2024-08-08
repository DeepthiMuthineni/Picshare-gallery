const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer');
const { body, validationResult } = require('express-validator');

const indexRoutes = require('./routes/index');
const uploadRoutes = require('./routes/upload');

const app = express();


mongoose.connect('mongodb+srv://test:test@cluster0.qe8xtft.mongodb.net/picshare?retryWrites=true&w=majority&appName=Cluster0')
const db = mongoose.connection;
db.on('error',console.error.bind(console, 'MongoDB connection error'));

const photoSchema = new mongoose.Schema({
  title: String,
  description: String,
  filename: String
});
const Photo = mongoose.model('Photo', photoSchema);


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage });


app.use('/', indexRoutes(Photo));  
app.use('/upload', uploadRoutes(Photo, upload, body, validationResult));  


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
