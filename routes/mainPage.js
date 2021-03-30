const { Router } = require('express');
const { Pages } = require('../models/page.model');
const router = Router();

const { JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');
const verifyToken = require('../utils/verifyToken');

router.get('/', async (req, res) => {
  try {
    const page = await Pages.findOne({ page: 'main' });
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
      
      res.status(403).json({
        message: 'Время сеанса вышло! Для продолжения войдите заново.',
        reload: true,
      });
    } else {
      try {
        await Pages.findOneAndUpdate({ page: 'main' }, req.body, {
          new: true,
        });
        res.status(200).json({ message: 'Изменения были внесены' });
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
