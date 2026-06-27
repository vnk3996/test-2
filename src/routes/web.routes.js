const { Router } = require('express');

const router = Router();

router.get('/', (req, res) => {
  res.render('home', {
    title: 'Node Express App',
    description: 'A Node.js + Express API server',
  });
});

module.exports = router;
