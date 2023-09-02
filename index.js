const express = require("express");
const cors = require("cors");
const multer = require("multer");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
var fs = require("fs");
var path = require("path");
app.set("view engine", "ejs");
const Contact = require("./models/contactModel");
const Project = require("./models/projectModel");
require("dotenv").config();
const url = process.env.MONGO_DB_URL;
const port = process.env.PORT;

mongoose.connect(url).then((res) => {
  console.log("Conncected To Server");
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now());
  },
});

var upload = multer({ storage: storage });

app.post("/addProject", upload.single("image"), async (req, resp, next) => {
  var obj = {
    title: req.body.title,
    desc: req.body.desc,
    link: req.body.link,
    img: {
      data: fs.readFileSync(
        path.join(__dirname + "/uploads/" + req.file.filename)
      ),
      contentType: "image/png",
    },
  };
  const projectAdd = await Project(obj).save();
  resp.send(projectAdd);
});

app.get("/getProjects", async (req, resp) => {
  const projectData = await Project.find();
  resp.send(projectData);
});

app.get("/", (req, resp) => {
  resp.send("Vercel Working");
});

app.post("/addContact", async (req, resp) => {
  const contactAdd = await new Contact(req.body).save();
  resp.send(contactAdd);
});

app.listen(port, () => {
  console.log("Server Running");
});
