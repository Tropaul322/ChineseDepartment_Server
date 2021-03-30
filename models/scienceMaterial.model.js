const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ScienceMaterials = new Schema(
  {
    scienceMaterials: [
      {
        name: { type: String, required: true },
        path: { type: String, required: true },
        docs: [
          {
            date: String,
            published: String,
            author: String,
            place: String,
            name: String,
            url: String,
          },
        ],
      },
    ],
  },
  { collection: 'scienceMaterials' }
);

const toResponseMaterials = (material) => {
  const { scienceMaterials } = material;
  return { scienceMaterials };
};

module.exports = {
  ScienceMaterials: mongoose.model('scienceMaterials', ScienceMaterials),
  toResponseMaterials,
};
