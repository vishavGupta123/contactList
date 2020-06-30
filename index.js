const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");
const port = 8000;
const db = require("./config/mongoose");
const Contact = require("./models/contact");
const User = require("./models/user");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(cookieParser());
app.use(express.urlencoded());
//middleware 1
// app.use(function(req,res,next){
//     console.log('middleware 1 called');

//     next();
// });
// //middleware2
// app.use(function(req,res,next){
//     console.log('middleware 2 called');
//     next();
// });
app.use(express.static("assets"));
var contactList = [
  {
    name: "Arpan",
    phoneNum: "1111111111",
  },
  {
    name: "tony stark",
    phoneNum: "1234567890",
  },
];

app.get("/", function (req, res) {
  Contact.find({}, function (err, contacts) {
    if (err) {
      console.log("error in fetching contacts from db");
      return;
    }
    return res.render("home", {
      title: "My Contacts List",
      contacts_list: contacts,
    });
  });
});
app.get("/practice", function (req, res) {
  return res.render("practice", {
    title: "Let us play with EJS",
  });
});
app.post("/create-contact", function (req, res) {
  // contactList.push({
  //     name : req.body.name,
  //     phoneNum : req.body.phone
  // });
  Contact.create(
    {
      name: req.body.name,
      phone: req.body.phone,
    },
    function (err, newContact) {
      if (err) {
        console.log("error in creating a contact");
        return;
      }
      console.log("**********", newContact);
      return res.redirect("back");
    }
  );
});
app.get("/signUp", function (req, res) {
  return res.render("user_sign_up");
});
app.get("/signIn", function (req, res) {
  return res.render("user_sign_in");
});
app.post("/create", function (req, res) {
  if (req.body.password != req.body.confirm_password) {
    return res.redirect("back");
  }
  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) {
      console.log("error in finding user signing up");
      return;
    }
    if (!user) {
      User.create(req.body, function (err, user) {
        if (err) {
          console.log("error in finding user signing up");
          return;
        }
        return res.redirect("/views/user_sign_in");
      });
    } else {
      return res.redirect("back");
    }
  });
});
app.get("/delete-contact", function (req, res) {
  console.log(req.query);
  let phone = req.query.phone;
  Contact.findOneAndDelete({ phone: phone }, function (err, contact) {
    if (err) {
      console.log("Internal server error ");
      return;
    }
  });

  res.redirect("back");
});
app.listen(port, function (err) {
  if (err) {
    console.log("error in running the server at", port);
  }
  console.log("server is running successfully");
});
