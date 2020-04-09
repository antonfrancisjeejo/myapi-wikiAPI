const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const app = express();

app.use(bodyParser.urlencoded({extended:true}));

app.set("view engine","ejs");

mongoose.connect("mongodb+srv://jeejo13:jeejo123@cluster0-q3jj1.mongodb.net/wikiDB",{useNewUrlParser:true,useUnifiedTopology:true});

const articleSchema = {
  title: String,
  content: String
};

const Article = mongoose.model("Article",articleSchema);

app.route("/articles")

.get((req,res)=>{
  Article.find({},(err,foundArticles)=>{
    if(!err){
      res.send(foundArticles);
    }else{
      res.send(err);
    }
  });
})
.post((req,res)=>{
  console.log(req.body.title);
  console.log(req.body.content);

  const article = new Article({
    title: req.body.title,
    content: req.body.content
  });
  article.save((err)=>{
    if(!err){
      res.send("Successfully added a new article");
    }
    else{
      res.send(err);
    }
  });
})
.delete((req,res)=>{
  Article.deleteMany({},(err)=>{
    if(!err){
      res.send("Successfully deleted all articles");
    }
    else{
      res.send(err);
    }
  });
});

app.route("/articles/:articleTitle")

.get((req,res)=>{
  Article.findOne({
    title: req.params.articleTitle
  },(err,foundArticle)=>{
    if(foundArticle){
      res.send(foundArticle);
    }else{
      res.send("No articles matching that title was found");
    }
  });
})
///////////////////////////Updates everything and if any not specified then removes it///////////////////////////
.put((req,res)=>{
  Article.update({
    title: req.params.articleTitle
  },{
    title: req.body.title,
    content: req.body.content
  },{
    overwrite: true
  },(err)=>{
    if(!err){
      res.send("Successfully updated");
    }
  });
})
/////////////////////////////////////Updates only the user updated content/////////////////////////////////
.patch((req,res)=>{
  Article.update({
    title: req.params.articleTitle
  },{$set: req.body},(err)=>{
    if(!err){
      res.send("Successfully updated");
    }
    else{
      res.send(err);
    }
  });
})
.delete((req,res)=>{
  Article.deleteOne({
    title: req.params.articleTitle
  },(err)=>{
    if(!err){
      res.send("Successfully deleted");
    }else{
      res.send(err);
    }
  });
});

app.listen(3000,()=>{
  console.log("Server started working at port 3000");
})
