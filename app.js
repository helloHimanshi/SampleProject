const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/SampleProjectDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const sampleSchema = new mongoose.Schema({
  email: String,
  password: String
});

const Sample = new mongoose.model("Sample", sampleSchema);

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {
  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    const newSample = new Sample({
      email: req.body.username,
      password: hash
    });
    newSample.save(err => {
      if (err) {
        console.log(err);
      } else {
        res.render("secrets");
      }
    });
  });
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  Sample.findOne({
    email: username
  }, (err, foundUser) => {
    if (err) {
      console.log(err);
    } else if (foundUser) {
      bcrypt.compare(password, foundUser.password, function(err, result) {
        if (result == true) {
          res.render("secrets");
        }
      });
    }
  })

});


app.listen(3000, () => {
  console.log("Server is running at port 3000");
});
