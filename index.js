const express = require('express');
const cors = require("cors");
const cheerio = require("cheerio");
const { default: axios } = require('axios');
const app = express();



app.use(express.json());
app.use(cors());

app.get('/v1', (req, res) => {
    const list = [];
    try {
        axios("https://kimetsu-no-yaiba.fandom.com/wiki/Kimetsu_no_Yaiba_Wiki")
            .then(rep => {
                const html = rep.data;
                const $ = cheerio.load(html);
                $(".portal", html).each(function () {
                    const name = $(this).find("a").attr("title");
                    const img = $(this).find("a > img").attr("data-src");
                    const link = $(this).find("a").attr("href");

                    list.push({ name: name, img: img, http: `https://demon-slayer-api-z3jl.onrender.com/v1/${link.split("wiki/")[1]}` });
                })

                res.json(list);
            })
    } catch (err) {
        res.status(500).json(err);
    }
})

app.get("/v1/:chacter", (req, res) => {
    const chacter = req.params.chacter;
    const list = [];
    const titles = [];
    const details = [];
    const info = {};
    const gallery = [];
    try {
        axios(`https://kimetsu-no-yaiba.fandom.com/wiki/${chacter}`)
            .then(rep => {
                const html = rep.data;
                const $ = cheerio.load(html);

                $("aside", html).each(function () {
                    const image = $(this).find(".pi-image-thumbnail").attr("src");
                    $(this).find("section > div > h3").each(function () {
                        titles.push($(this).text());
                    });
                    $(this).find("section > div > div").each(function () {
                        details.push($(this).text());
                    });

                    $(".wikia-gallery-item", html).each(function () {
                        const imgs = $(this).find("a > img").attr("data-src");
                        gallery.push(imgs);
                    })

                    if (image !== undefined) {
                        for (let i = 0; i < titles.length; ++i) {
                            info[titles[i]] = details[i];
                        }
                        list.push({
                            name: chacter.replace("_", " "),
                            img: image,
                            gallery: gallery,
                            info: info
                        });
                    }
                })

                res.json(list);
            })
    } catch (err) {

    }
})


app.listen(3000, () => {
    console.log("http://localhost:3000");
})