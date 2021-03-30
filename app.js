const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json({ extended: true }));

app.use('/file', require('./routes/imagePost.js'));
app.use('/about', require('./routes/aboutPage.js'));
app.use('/teachers', require('./routes/teachersPage.js'));
app.use('/study', require('./routes/studyPage.js'));
app.use('/science', require('./routes/sciencePage.js'));
app.use('/contacts', require('./routes/contactPage.js'));
app.use('/news', require('./routes/newsPage.js'));
app.use('/auth', require('./routes/auth.routes.js'));
app.use('/', require('./routes/mainPage.js'));

module.exports = app;
