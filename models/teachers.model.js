const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Teachers = new Schema(
  {
    name: String,
    photo: String,
    position: String,
    degree: String,
    subjects: String,
    about: String,
    publications: [{ title: String, published: String, url: String }],
    contacts: { email: String, mobile: String, website: String},
  },
  { collection: 'teachers' }
);

const toResponseTeacher = (teachers) => {
  const {
    name,
    photo,
    position,
    degree,
    subjects,
    about,
    publications,
    contacts,
  } = teachers;
  return {
    name,
    photo,
    position,
    degree,
    subjects,
    about,
    publications,
    contacts,
  };
};

module.exports = {
  Teachers: mongoose.model('teachers', Teachers),
  toResponseTeacher,
};
