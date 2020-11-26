import express from "express";
import handlebars from "express-handlebars";   
import NewsAPI from "newsapi";
import secrets from "./secrets.json"

const newsapi = new NewsAPI(secrets.newsAPIKey);

// Set up express
const app = express();

// Json midleware that can parse json body request
// body request is a string after parsing becomes a JSON. 
// ---> req.body becomes a object rather than a string
app.use(express.json())

const hbs = handlebars.create({extname: "html", defaultLayout: "index"});
console.log(hbs);

//What is a  view engine? It is about parsing strings and files and generating html. 
// it has some files, then those files parsed because they are in a certain format, 
// the format allows to add data into the file and then thats is rendered as HTML

app.engine(".html", hbs.engine);

app.set("view engine", ".html");
app.set("views", `${__dirname}/views`);

// use the render method to load a specific content and mainly html
app.get("/", (req, res) => {
    // 1st param file name, 2nd: data, call back that includes res + error
    app.render("index", {}, (err, html)=>{ 
        res.send(html)
    })
});

// post using a request body (sending something to the server)
// is not part of the convention to use the get method with a requesd body
app.post("/search", (req, res) => {
    newsapi.v2.everything({
        q: req.body.query,
        // sources: 'bbc-news,the-verge',
        // domains: 'bbc.co.uk, techcrunch.com',
        // from: '2017-12-01',
        // to: '2017-12-12',
        // language: 'en',
        // sortBy: 'relevancy',
        // page: 2
      }).then((response)=> res.json(response));
    console.log(req.body.query)

    
})

// use get route using query param q (asking something from the server)
// get shouldn't change anything in the server, but POST, PUT and DELETE can. 
app.get("/search", (req, res) => {

    newsapi.v2.everything({
        q: req.query["q"],
        // sources: 'bbc-news,the-verge',
        // domains: 'bbc.co.uk, techcrunch.com',
        // from: '2017-12-01',
        // to: '2017-12-12',
        // language: 'en',
        // sortBy: 'relevancy',
        // page: 2
      }).then((response)=> res.json(response));
    console.log(req.query.q)
})


//using Route parameter
app.get("/:lang/search", (req, res) => {
    newsapi.v2.everything({
        q: req.query["q"],
        // sources: 'bbc-news,the-verge',
        // domains: 'bbc.co.uk, techcrunch.com',
        // from: '2017-12-01',
        // to: '2017-12-12',
        language: req.params["lang"],
        // sortBy: 'relevancy',
        // page: 2
      }).then((response)=> res.json(response));
    console.log(req.query.q)
})


app.listen(4000);

