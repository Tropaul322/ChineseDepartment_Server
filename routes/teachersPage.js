const { Router } = require('express');
const { Pages } = require('../models/page.model');
const { Teachers } = require('../models/teachers.model');
const { toResponseTeacher } = require('../models/teachers.model');
const router = Router();

const { JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');
const verifyToken = require('../utils/verifyToken');

router.get('/', async (req, res) => {
  try {
    const page = await Pages.findOne({ page: 'teachers' });
    const teachers = await Teachers.find({});
    res.status(200).json({ teachers, page });
  } catch (e) {
    res.status(500).json({
      message: 'Произошла ошибка, попробуйте перезагрузить страницу',
      e: e.message,
    });
  }
});

router.get('/:name', async (req, res) => {
  try {
    const teacher = await Teachers.findOne({ name: req.params.name });
    res.status(200).json(toResponseTeacher(teacher));
  } catch (e) {
    res.status(500).json({
      message: 'Произошла ошибка, попробуйте перезагрузить страницу',
      e: e.message,
    });
  }
});

router.put('/:id', verifyToken, (req, res) => {
  jwt.verify(req.token, JWT_SECRET, async (err) => {
    if (err) {
      res.status(403).json({
        message: 'Время сеанса вышло! Для продолжения войдите заново.',
      });
    } else {
      try {
        const teacher = await Teachers.findOneAndUpdate(
          { _id: req.params.id },
          req.body,
          { new: true }
        );
        res
          .status(200)
          .json({ message: 'Данные преподавателя изменены!', reload: true });
      } catch (e) {
        res.status(500).json({
          message: 'Произошла ошибка, попробуйте перезагрузить страницу.',
          e: e.message,
        });
      }
    }
  });
});

router.post('/', verifyToken, (req, res) => {
  jwt.verify(req.token, JWT_SECRET, async (err) => {
    if (err) {
      res.status(403).json({
        message: 'Время сеанса вышло! Для продолжения войдите заново.',
      });
    } else {
      try {
        const teacher = await Teachers.create(req.body);
        teacher.save();
        res
          .status(200)
          .json({ message: 'Новый преподаватель добавлен!', reload: true });
      } catch (e) {
        res.status(500).json({
          message: 'Произошла ошибка, попробуйте перезагрузить страницу.',
          e: e.message,
        });
      }
    }
  });
});

router.delete('/:id', verifyToken, (req, res) => {
  jwt.verify(req.token, JWT_SECRET, async (err) => {
    if (err) {
      res.status(403).json({
        message: 'Время сеанса вышло! Для продолжения войдите заново.',
      });
    } else {
      try {
        const teacher = await Teachers.findOne({ _id: req.params.id });
        teacher.delete();
        res.status(200).json({
          message: 'Данные преподавателя были удалены!',
          reload: true,
        });
      } catch (e) {
        res.status(500).json({
          message: 'Произошла ошибка, попробуйте перезагрузить страницу.',
          e: e.message,
        });
      }
    }
  });
});

module.exports = router;
