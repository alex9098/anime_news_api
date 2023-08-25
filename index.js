const express = require('express')
const cheerio = require('cheerio')
const axios = require('axios')
const cors = require("cors")
const app = express()
app.use(cors({origin:"*"}))
const PORT = process.env.PORT || 3000
let news = []
async function webscrapper(res,cat) {
    try {
        let url
        switch(cat) {
            case "anime":
              url = `https://www.cbr.com/category/anime-news/`
              break;
            case "movie":
              url = "https://www.cbr.com/category/movies/news-movies/"
              break;
            case "comic":
              url = "https://www.cbr.com/category/comics/news/"
              break;
            case "series":
              url = "https://www.cbr.com/category/tv/news-tv/"
              break;
            case "games":
              url = "https://www.cbr.com/category/game-news/"
              break;
          }
        const responce = await axios.get(url)
        const html = responce.data
        const $ = cheerio.load(html)
        $(".display-card.article.small", html).each(function(){
          const image =  $(this).find('source').attr("srcset")
          const heading = $(this).find("h5").text().replace(/\s\s+/g, '')
          const para = $(this).find("p").text().replace(/\s\s+/g, '')
          const source = "https://www.cbr.com/"
          const one = {image,heading,para,source}
          news = [...news,one]

        })

        res.json(news)
    } catch (error) {
        console.log(error)
    }
    
}
webscrapper()
app.get('/anime', async (req,res)=>{
    webscrapper(res,"anime")
})
app.get('/movie', async (req,res)=>{
    webscrapper(res,"movie")
})
app.get('/comic', async (req,res)=>{
    webscrapper(res,"comic")
})
app.get('/series', async (req,res)=>{
    webscrapper(res,"series")
})
app.get('/games', async (req,res)=>{
    webscrapper(res,"games")
})





app.listen(PORT,()=>{
    console.log("Online Now");
})