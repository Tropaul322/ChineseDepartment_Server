const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PagesNew = new Schema(
  {
    page: { type: String, required: true },
    label: String,
    heading: String,
    mainDescription: String,
    featuresTitle: String,
    featuresInfo: String,
    detailsTitle: String,
    detailsInfo: String,
    addressPlace: String,
    addressRoom: String,
    mailName: String,
    email: String,
    personWebsite: String,
    personEmail: String,
    mobile: String,
  },
  { collection: 'pages' }
);

module.exports = {
  Pages: mongoose.model('pages', PagesNew),
};
