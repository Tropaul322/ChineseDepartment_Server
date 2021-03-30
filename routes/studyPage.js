const { Router } = require('express');
const { Pages } = require('../models/page.model');
const { Materials } = require('../models/materials.model');
const router = Router();

const { JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');
const verifyToken = require('../utils/verifyToken');

router.get('/', async (req, res) => {
  try {
    const page = await Pages.findOne({ page: 'study' });
    const material = await Materials.find();
    const result = {
      materials: material,
      page: page,
    };
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json({
      message: 'Произошла ошибка, попробуйте перезагрузить страницу',
      e: e.message,
    });
  }
});

router.post('/:selector', verifyToken, (req, res) => {
  jwt.verify(req.token, JWT_SECRET, async (err) => {
    if (err) {
      res.status(403).json({
        message: 'Время сеанса вышло! Для продолжения войдите заново.',
      });
    } else {
      try {
        const material = await Materials.find({});
        material[0].materials.map((el) => {
          if (el.path === req.params.selector) {
            let array = el.docs.filter(
              (el) => el.year === parseInt(req.params.year)
            );
            array.push(req.body);
            res
              .status(200)
              .json({ message: 'Материал добавлен!', reload: true });
          }
        });
        material[0].save();
      } catch (e) {
        res.status(500).json({
          message: 'Произошла ошибка, попробуйте перезагрузить страницу',
          e: e.message,
        });
      }
    }
  });
});

router.delete('/:selector/', verifyToken, (req, res) => {
  jwt.verify(req.token, JWT_SECRET, async (err) => {
    if (err) {
      res.status(403).json({
        message: 'Время сеанса вышло! Для продолжения войдите заново.',
      });
    } else {
      try {
        const material = await Materials.find({});
        material[0].materials.map((el) => {
          if (el.path === req.params.selector) {
            material[0].materials.splice(id, 1);
            material[0].save();
          }
        });
        res.status(200).json({ message: 'Материал добавлен!', reload: true });
      } catch (e) {
        res.status(500).json({
          message: 'Произошла ошибка, попробуйте перезагрузить страницу',
          e: e.message,
        });
      }
    }
  });
});

router.put('/:selector', verifyToken, (req, res) => {
  jwt.verify(req.token, JWT_SECRET, async (err) => {
    if (err) {
      res.status(403).json({
        message: 'Время сеанса вышло! Для продолжения войдите заново.',
      });
    } else {
      try {
        const material = await Materials.find({});
        material[0].materials.map((el, id) => {
          if (el.path === req.params.selector) {
            material[0].materials.splice(id, 1, { ...req.body });
          }
        });
        material[0].save();
        res.status(200).json({ message: 'Материал изменен!', reload: true });
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
