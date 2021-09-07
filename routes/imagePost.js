const express = require('express');

const router = express.Router();

const jwt = require('jsonwebtoken');
const verifyToken = require('../utils/verifyToken');

const { SECRET_ACCESS_KEY, ACCESS_KEY_ID, REGION, JWT_SECRET } = process.env;
const aws = require('aws-sdk');
const multerS3 = require('multer-s3');
const multer = require('multer');
const path = require('path');

aws.config.update({
  secretAccessKey: SECRET_ACCESS_KEY,
  accessKeyId: ACCESS_KEY_ID,
  region: REGION,
});

const s3 = new aws.S3();

const fileFilter = (req, file, cb) => {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif|txt|pdf|doc|docx/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Files Only!');
  }
};

const photoFilter = (req, file, cb) => {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    return cb('Error: Images Only!');
  }
};

const uploadPhoto = multer({
  storage: multerS3({
    s3,
    bucket: 'chinesedepartment',
    acl: 'public-read',
    key: function (req, file, cb) {
      cb(
        null,
        path.basename(file.originalname, path.extname(file.originalname)) +
          '-' +
          Date.now() +
          path.extname(file.originalname)
      );
    },
  }),
  fileFilter: photoFilter,
});

const uploadFile = multer({
  storage: multerS3({
    s3,
    bucket: 'chinesedepartment',
    acl: 'public-read',
    key: function (req, file, cb) {
      cb(
        null,
        path.basename(file.originalname, path.extname(file.originalname)) +
          '-' +
          Date.now() +
          path.extname(file.originalname)
      );
    },
  }),
  fileFilter: fileFilter,
});

const uploadsGallery = multer({
  storage: multerS3({
    s3,
    bucket: 'chinesedepartment',
    acl: 'public-read',
    key: function (req, file, cb) {
      cb(
        null,
        path.basename(file.originalname, path.extname(file.originalname)) +
          '-' +
          Date.now() +
          path.extname(file.originalname)
      );
    },
  }),
  fileFilter: photoFilter,
});

const single = uploadPhoto.single('image');
const files = uploadFile.array('file');
const many = uploadsGallery.array('images', 4);

router.post('/upload', verifyToken, (req, res) => {
  jwt.verify(req.token, JWT_SECRET, async (err) => {
    if (err) {
      res.status(403).json({
        message: 'Время сеанса вышло! Для продолжения войдите заново.',
      });
    } else {
      single(req, res, (err) => {
        if (err) {
          return res.status(422).send({
            message: 'Данный формат не поддерживается.',
          });
        }
        res.status(200).json(req.file.location);
      });
    }
  });
});

router.delete('/delete/:name', verifyToken, (req, res) => {
  jwt.verify(req.token, JWT_SECRET, async (err) => {
    if (err) {
      res.status(403).json({
        message: 'Время сеанса вышло! Для продолжения войдите заново.',
      });
    } else {
      await s3
        .deleteObject({
          Key: req.params.name,
          Bucket: 'chinesedepartment',
        })
        .promise();
      return res.status(288).send('Deleted');
    }
  });
});
router.post('/upload/file', verifyToken, (req, res) => {
  jwt.verify(req.token, JWT_SECRET, async (err) => {
    if (err) {
      res
        .status(403)
        .json({ message: 'Forbidden: попробуйте перезайти в систему' });
    } else {
      files(req, res, (err) => {
        if (err) {
          return res.status(422).send({
            message: 'Данный формат не поддерживается.',
          });
        }
        const locations = [];
        req.files.forEach((el) => {
          locations.push(el.location);
        });
        res.status(200).json(locations);
      });
    }
  });
});

router.delete('/delete/file/:name', verifyToken, (req, res) => {
  jwt.verify(req.token, JWT_SECRET, async (err) => {
    if (err) {
      res
        .status(403)
        .json({ message: 'Forbidden: попробуйте перезайти в систему' });
    } else {
      await s3
        .deleteObject({
          Key: req.params.name,
          Bucket: 'chinesedepartment',
        })
        .promise();
      return res.status(288).send('gi');
    }
  });
});

router.post('/multiple-file-upload', verifyToken, (req, res) => {
  jwt.verify(req.token, JWT_SECRET, async (err) => {
    if (err) {
      res
        .status(403)
        .json({ message: 'Forbidden: попробуйте перезайти в систему' });
    } else {
      many(req, res, (err) => {
        if (err) {
          return res.status(422).send({
            message: 'Данный формат не поддерживается.',
          });
        }
        const locations = [];
        req.files.forEach((el) => {
          locations.push(el.location);
        });
        res.status(200).json(locations);
      });
    }
  });
});

module.exports = router;
