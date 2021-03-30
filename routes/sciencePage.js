const { Router } = require('express');
const { Pages } = require('../models/page.model');
const { ScienceMaterials } = require('../models/scienceMaterial.model');
const router = Router();

const { JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');
const verifyToken = require('../utils/verifyToken');

router.get('/', async (req, res) => {
  try {
    const page = await Pages.findOne({ page: 'science' });
    const material = await ScienceMaterials.find();
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
        const material = await ScienceMaterials.find({});
        material[0].scienceMaterials.map((el) => {
          if (el.path === req.params.selector) {
            el.docs.push(req.body);
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

router.delete('/:selector/:id', verifyToken, (req, res) => {
  jwt.verify(req.token, JWT_SECRET, async (err) => {
    if (err) {
      res.status(403).json({
        message: 'Время сеанса вышло! Для продолжения войдите заново.',
      });
    } else {
      try {
        const material = await ScienceMaterials.find({});
        material[0].scienceMaterials.map((el) => {
          if (el.path === req.params.selector) {
            el.docs.map((element, id) => {
              if (element.id === req.params.id) {
                el.docs.splice(id, 1);
              }
            });
          }
        });
        material[0].save();
        res.status(200).json({ message: 'Материал удален', reload: true });
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
        const scienceMaterials = await ScienceMaterials.find({});
        scienceMaterials[0].scienceMaterials.map((el, id) => {
          if (el.path === req.params.selector) {
            scienceMaterials[0].scienceMaterials.splice(id, 1, { ...req.body });
          }
        });
        scienceMaterials[0].save();
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
