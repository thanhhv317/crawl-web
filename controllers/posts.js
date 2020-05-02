const puppeteer = require('puppeteer');
const request = require("request-promise");
const Promise = require("bluebird");
const trim = require("lodash/trim");
const Posts = require('../models/posts');
const { convertText2Slug } = require("../utils");
module.exports = {
    crawlAllData: async (req, res) => {
        // get links
        let i = 1;
        const links = [];
        const domain = "https://kipalog.com";
        while (true) {
            const data = await request(`${domain}/tags/Javascript/pagination?page=${i++}`);
            const articles = JSON.parse(data);

            if (articles.length === 0) {
                break;
            }

            articles.forEach(article => {
                links.push(article.path)
            });

        }


        // crawl data
        const browser = await puppeteer.launch({ headless: false });

        await Promise.mapSeries(links, async (link) => {
            const page = await browser.newPage();
            await page.goto(`${domain}${link}`);
            const title = await page.evaluate(() => {
                return document.querySelector("h1 strong").innerText
            });

            const slug = convertText2Slug(title);

            const author = await page.evaluate(() => {
                return document.querySelector(`div.info .name h3`).innerText;
            })

            const avatar = await page.evaluate(() => {
                return document.querySelector(`div .meta-profile > a > img.lazy`).src
            })

            const content = await page.evaluate(() => {
                return document.querySelector("div #content").innerHTML
            });
            const post = Posts({
                title,
                slug,
                author: trim(author, " \n"),
                avatar,
                content
            })
            await post.save();
            console.log(title);
            console.log(slug);
            await page.close();
        });
        await browser.close();

        return res.json({
            success: true
        })
    },

    readData: async (req, res) => {
        const posts = await Posts.find({}).lean();
        return res.render('crawl/index', { title: 'crawl web', data: posts });
    },

    getPostBySlug: async (req, res) => {
        const slug = req.params.slug;
        const post = await Posts.find({
            slug
        }).lean();
        return res.json({
            success: true,
            data: post
        });
    }
}

