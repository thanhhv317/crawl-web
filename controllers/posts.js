const puppeteer = require("puppeteer");
const request = require("request-promise");
const Promise = require("bluebird");
const trim = require("lodash/trim");
const Posts = require("../models/posts");
const cheerio = require("cheerio");
const moment = require("moment");
const { convertText2Slug } = require("../utils");

const getDate = (date) => (date ? moment(date, "DD/MM/YYYY").toDate() : date);
module.exports = {
  crawlAllData: async (req, res) => {
    // get links
    let i = 1;
    const links = [];
    const domain = "https://kipalog.com";
    while (true) {
      const data = await request(
        `${domain}/tags/Javascript/pagination?page=${i++}`
      );
      const articles = JSON.parse(data);

      if (articles.length === 0) {
        break;
      }

      articles.forEach((article) => {
        links.push({
          path: article.path,
          preview: article.preview
        });
      });
    }

    // crawl data
    const browser = await puppeteer.launch({ headless: false });

    await Promise.mapSeries(links, async (link) => {
      // const result = await request(`${domain}${link.path}`);
      // const $ = cheerio.load(result);

      // const title = $("h1 strong").text();
      // const slug = convertText2Slug(title);
      // const author = $("div.info .name h3").text();
      // const avatar = $("div .meta-profile > a > img.lazy").attr("src");
      // const { preview } = link;
      // const content = $("div #content").html();
      // const text = $("h1 .published .date").text()
      // const createdDate = getDate(text.replace(/[^\d\/]/g, ""));

      const page = await browser.newPage();
      await page.goto(`${domain}${link.path}`);
      const title = await page.evaluate(() => {
        return document.querySelector("h1 strong").innerText;
      });

      const slug = convertText2Slug(title);

      const author = await page.evaluate(() => {
        return document.querySelector(`div.info .name h3`).innerText;
      });

      const avatar = await page.evaluate(() => {
        return document.querySelector(`div .meta-profile > a > img.lazy`).src;
      });

      const content = await page.evaluate(() => {
        return document.querySelector("div #content").innerHTML;
      });

      const { preview } = link;

      const text = await page.evaluate(() => {
        return document.querySelector("h1 .published .date").innerText;
      });

      const createdDate = getDate(text.replace(/[^\d\/]/g, ""));
      const post = Posts({
        title,
        slug,
        author: trim(author, " \n"),
        avatar,
        content,
        preview,
        createdDate
      });
      await post.save();
      console.log(title);
      console.log(slug);
      await page.close();
    });
    await browser.close();

    return res.json({
      success: true,
    });
  },

  readData: async (req, res) => {
    const posts = await Posts.find({}).lean();
    return res.render("crawl/index", { title: "crawl web", data: posts });
  },

  getPostBySlug: async (req, res) => {
    const slug = req.params.slug;
    const post = await Posts.find({
      slug,
    }).lean();
    return res.json({
      success: true,
      data: post,
    });
  },

  getListPosts: async (req, res) => {
    const { page = 1 } = req.query;
    const limit = 20;
    const skip = (page -1) * 20;
    const listPosts = await Posts.find({}, { content: 0, avatar: 0 })
      .sort({ createdDate: -1 })
      .limit(limit)
      .skip(skip)
      .lean();
    return res.json({
      success: true,
      data: listPosts,
    });
  },
};
