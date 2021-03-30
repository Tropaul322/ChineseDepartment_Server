require('dotenv').config()
const mongoose = require('mongoose');
const app = require('./app.js');

const {PORT, MONGO_URI} = process.env;


mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const db = mongoose.connection;

db.on('error', () => console.log('MongoDB connection error!')).once(
  'open',
  () => {
    console.log('Successfully connect to DB');
    app.listen(PORT, () =>
      console.log(`App is running`)
    );
  }
);
