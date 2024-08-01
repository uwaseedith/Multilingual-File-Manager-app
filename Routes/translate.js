const express = require('express');
const router = express.Router();
const i18next = require('../config/i18n');

router.use((req, res, next) => {
  const { lang } = req.query;
  i18next.changeLanguage(lang || 'en');
  next();
});

router.get('/translate', (req, res) => {
  const translatedMessage = i18next.t(messageKey);

  res.json({ message: translatedMessage });
});

module.exports = router;
