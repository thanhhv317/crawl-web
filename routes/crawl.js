const express = require('express');
const router = express.Router();
const crawlController = require('../controllers/crawl');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

/* POST crawl data . */
router.post('/crawl', crawlController.crawl);

router.get('/posts/:slug', crawlController.getPostBySlug);



/* GET home page. */
router.get('/view', crawlController.readData);




module.exports = router;
