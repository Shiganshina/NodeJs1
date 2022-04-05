const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Blog = require('./Models/blog');
const { render } = require('express/lib/response');

const app = express();

const mongodb="mongodb+srv://Galadriel:trial123@sakura.xsnrg.mongodb.net/NodeJs1?retryWrites=true&w=majority";
mongoose.connect(mongodb)
    .then((result) => app.listen(3000))
    .catch((err) => console.log(err))

app.set("view engine", "ejs");
app.set("views", "Pages");

app.use(express.static("CSS"));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.get("/", (req, res) =>{
    res.redirect("/all-blogs")
});

app.get("/all-blogs", (req,res) => {
    Blog.find().sort( {createdAt: -1} )
        .then((result) => {
            res.render('index', { title : 'All Blogs', blogs: result})
        })
        .catch((err) => {
            console.log(err);
        })
})

app.post("/all-blogs", (req,res) => {
    const blog = new Blog(req.body);

    blog.save()
        .then((result) => {
            res.redirect("/all-blogs");
        })
        .catch((err) => {
            console.log(err);
        })
})

app.get("/blogs", (req, res) =>{
    res.render("about", { title: "About" });
});

app.get("/all-blogs/:id", (req,res) => {
    const id = req.params.id;
    Blog.findById(id)
        .then((result) => {
            res.render('details', ({ blog: result, title: "Blog Details" }))
        })
        .catch((err) => {
            console.log(err);
        })
});

app.delete("/all-blogs/:id", (req,res) => {
    const id = req.params.id;

    Blog.findByIdAndDelete(id)
        .then((result) => {
            res.json({ redirect: '/all-blogs' });
        })
        .catch((err) => {
            console.log(err);
        })
})

app.get("/blogs/create", (req, res) =>{
    res.render("create", { title: "Create" });
});

app.use((req,res) => {
    res.status(404).render("404", { title: "404" });
});


