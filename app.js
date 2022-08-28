require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Post = require(__dirname + '/models/models.js');
const Admin = require(__dirname + '/models/admin.js');
const app = express();
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

app.use(express.urlencoded({extended: true}));
app.use(express.static("Public"));
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.set('view engine', 'ejs');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(process.env.DB_URL);
}

passport.use(Admin.createStrategy());

passport.serializeUser(Admin.serializeUser());
passport.deserializeUser(Admin.deserializeUser());

function loggedIn(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.redirect('/login');
    }
}

let cID = "";

app.route('/')
  .get((req,res) => {
    Post.find({}, function(err, posts){
      if (!err) {
        res.render("home", {blog:posts, user:req.user});
      }
    });
  })

/*------------------Single Post Page------------------*/
app.get("/posts/:blogID", function(req,res){
  const reqTitle = req.params.blogID.toLowerCase();
  Post.find({}, function(err, posts){
    if (!err) {
      posts.forEach(function(post){
        if(post.title.toLowerCase() === reqTitle) {
          res.render("posts",{postFull:post,user:req.user});
        }
      });
    }
  });
});

/*------------------About------------------*/
app.get("/about", function(req,res){
  res.render("about",{user:req.user});
});
/*------------------Contact------------------*/
app.get("/contact", function(req,res){
  res.render("contact",{user:req.user});
});

/*------------------Admin------------------*/
app.route('/admin')
  .get(loggedIn, function(req,res){
    res.render("admin",{user:req.user});
  })

/*------------------Compose------------------*/
app.route('/compose')
  .get(loggedIn, function(req,res){
    res.render("compose",{user:req.user});
  })
  .post((req,res) => {
    const post = new Post ({
      title: req.body.cTitle,
      date: req.body.cDate,
      body: req.body.bloggerText
    });
    post.save(function(err){
      if (err) {
        console.log(err);
        res.redirect('/compose');
      } else {
        res.redirect("/");
      }
    });
  })

/*------------------Update------------------*/
app.route('/update')
  .get(loggedIn, function(req,res){
    res.render("update",{user:req.user});
  })
  .post(function (req,res) {
    if (req.body.Title == "") {
      res.redirect('/update');
    }else {

      Post.findOne({title: req.body.Title}, function (err, post) {
        if (err) {
          console.log(err);
        } else if (post) {
          cID = post._id;
          res.render('updateForm', {post: post, user: req.user});
        } else {
          res.render('issue',{user: req.user});
        }
      })
    }
  })

app.post('/updateForm', function(req,res){
  uPost = req.body;

  Post.updateOne({_id: cID},{date: uPost.uDate, body: uPost.updateText}, function(err, result){
    if (err) {
      console.log(err);
    } else {
      console.log('Post updated!');
      cID = "";
      res.redirect('/admin');
    }
  })
})

/*------------------Delete------------------*/
app.post('/delete',function (req,res){
  Post.deleteOne({_id: cID}, function(err, ret){
    if (err) {
      console.log(err);
    } else {
      res.redirect('/admin');
    }
  })
});

/*------------------Login------------------*/
app.route('/login')
  .get((req,res) => {
    res.render('login',{user:req.user});
  })
  .post(passport.authenticate('local', {
    successRedirect: '/admin',
    failureRedirect: '/login',
  }))

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.all("*", (req, res) => {
  if (res.status(404)) {
    res.render('404',{user:req.user});
  }
});

app.listen(4000, function(){
  console.log("Server started");
});
