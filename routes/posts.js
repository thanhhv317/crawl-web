const express = require("express");
const router = express.Router();
const postsController = require("../controllers/posts");

/* GET home page. */
router.get("/", (req, res, next) => {
  res.render("index", { title: "Express" });
});

/* POST crawl data . */
router.post("/crawl", postsController.crawlAllData);

router.get("/posts/:slug", postsController.getPostBySlug);

/* GET home page. */
router.get("/view", postsController.readData);

module.exports = router;
