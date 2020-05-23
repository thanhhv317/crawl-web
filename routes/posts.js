const express = require("express");
const router = express.Router();
const postsController = require("../controllers/posts");

/* GET home page. */
router.get("/", (req, res, next) => {
  res.render("index", { title: "Blog-MT" });
});

/* POST crawl data . */
router.post("/posts/crawl", postsController.crawlAllData);

router.get("/posts/:slug", postsController.getPostBySlug);

/* GET home page. */
router.get("/view", postsController.readData);

router.get("/posts", postsController.getListPosts);

module.exports = router;
