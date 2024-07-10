const express = require("express");
const fs = require("node:fs/promises");
const { schemaValidator, formValidate } = require("./validator/FormValidator");
const session = require("express-session");
const flash=require("express-flash")
const {
  schemaLoginValidator,
  loginValidate,
} = require("./validator/LoginValidator");
const helper_log = require("./logging/helper_log");
const cookieParser = require("cookie-parser");
const AuthLogin = require("./middleware/AuthLogin");
const app = express();
//writing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("./public"));

app.use(cookieParser("express-session"));
app.use(
  session({
    secret: "express-session",
    saveUninitialized: true,
    resave: false,
  })
);
app.use(helper_log);
app.use(flash());
app.set("view engine", "ejs");
app.set("views", "view");
app.get("/", async (req, res, next) => {
  try {
    let result = await fs.readFile("./data.json", "utf-8");
    res.render("home", {
      title: "Home Page",
      data: JSON.parse(result),
    });
  } catch (m) {
    res.status(500).render("error-handling", {
      http_code: 500,
      message: m,
    });
  }
});
app.get("/form",AuthLogin, (req, res) => {
  res.render("form", {
    title: "Form Data",
    message: [],
  });
});
app.post("/form",AuthLogin, [schemaValidator, formValidate], async (req, res) => {
  try {
    const { name_product, price_product, supplier } = req.body;
    const result = await fs.readFile("./data.json", "utf-8");
    const oldData = JSON.parse(result);
    const tmpData = {
      id_product: oldData[oldData.length - 1].id_product + 1,
      name_product,
      price_product,
      supplier,
    };
    oldData.push(tmpData);
    await fs.writeFile("./data.json", JSON.stringify(oldData));
    req.flash("add_success", "Data berhasil ditambahkan");
    res.redirect("/");
  } catch (m) {
    res.status(500).render("error-handling", {
      http_code: 500,
      message: m,
    });
  }
});

app.get("/login", (req, res, next) => {
  res.render("login");
});
app.post("/login", [schemaLoginValidator, loginValidate], (req, res) => {
  try {
    const { username, password } = req.body;
    if (username == "admin" && password == "admin") {
      req.session.auth = {
        auth: true,
        username: username,
      };
      req.flash("login_success","Login success");
      res.redirect("/form");
    } else {
      req.flash("login_failed","Login failed")
      res.redirect("/login");
    }
  } catch (m) {}
});
app.get("/logout",(req,res,next)=>{
  req.session.auth=null;
  return res.redirect("/")
})
app.listen(3000, () =>
  console.log(`Running web server in url http://localhost:3000`)
);
