import express, { response } from "express";
import axios from "axios";
import bodyParser from "body-parser";
import $ from "jquery";

const app = express();
const port = "3000";
const baseUrl = 'https://api.mangadex.org';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {
  res.render("index.ejs");
});

app.post("/search", async (req, res) => {
  const title = `${req.body.title}`;
  try {
    const respManga = await axios.get(`${baseUrl}/manga`, {params: {"title": title}});
    const id = respManga.data.data.map(manga => manga.id);

    const respChapter = await axios.get(`${baseUrl}/manga/${id[0]}/feed`);
    const chapterId = respChapter.data.data[0].id;
   
    const respImg = await axios.get(`${baseUrl}/at-home/server/${chapterId}`);
    const hash = respImg.data.chapter.hash;
    const images = respImg.data.chapter.data;
    
    console.log(baseUrl + "/" + "data/" + hash + "/" + images[0]);
    res.render("index.ejs", {hash: hash, images: images, baseUrl: baseUrl, ready: true});
  } catch (error) {
    console.log(`this is the error: ${error}`);
  }

  
});

app.listen(port, () => {
  console.log(`Welcome, Agent ${port}`);
})