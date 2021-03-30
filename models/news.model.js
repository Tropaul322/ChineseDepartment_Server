const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const News = new Schema(
  {
    date: String,
    coverPhoto: String,
    title: String,
    description: String,
    article: String,
    photos: [String],
  },
  { collection: 'news' }
);

module.exports = {
  News: mongoose.model('news', News),
};
