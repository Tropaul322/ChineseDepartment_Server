const { Router } = require('express');
const { Pages } = require('../models/page.model');
const router = Router();

const { JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');
const verifyToken = require('../utils/verifyToken');

router.get('/', async (req, res) => {
  try {
    const page = await Pages.findOne({ page: 'about' });
    res.status(200).json(page);
  } catch (e) {
    res.status(500).json({
      message: 'Произошла ошибка, попробуйте перезагрузить страницу',
      e: e.message,
    });
  }
});

router.put('/', verifyToken, (req, res) => {
  jwt.verify(req.token, JWT_SECRET, async (err) => {
    if (err) {
      
      res.status(403).json({ message: 'Forbidden' });
    } else {
      try {
        await Pages.findOneAndUpdate({ page: 'about' }, req.body, {
          new: true,
        });
        res
          .status(200)
          .json({ message: 'Изменения были внесены', reload: true });
      } catch (e) {
        res.status(500).json({
          message: 'Произошла ошибка, попробуйте перезагрузить страницу',
          e: e.message,
        });
      }
    }
  });
});

module.exports = router;
