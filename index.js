const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  fs.readdir(path.join(__dirname, "files"), (err, files) => {
    if (err) {
      console.error("Error reading tasks directory:", err);
      return res.status(500).send("Internal Server Error");
    }
    res.render("index", { files: files });
  });
});

app.post("/create", (req, res) => {
  fs.writeFile(
    `files/${req.body.title.split(" ").join("_")}.txt`,
    req.body.details,
    (err) => {
      if (err) {
        console.error("Error creating task:", err);
        return res.status(500).send("Internal Server Error");
      }
      res.redirect("/");
    },
  );
});

app.get("/file/:filename", (req, res) => {
  const filePath = path.join(__dirname, "files", req.params.filename);
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading task file:", err);
      return res.status(500).send("Internal Server Error");
    }
    res.render("show", { filename: req.params.filename, fileContent: data });
  });
});

app.get("/edit/:filename", (req, res) => {
  const filePath = path.join(__dirname, "files", req.params.filename);
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading task file:", err);
      return res.status(500).send("Internal Server Error");
    }
    res.render("edit", { filename: req.params.filename, fileContent: data });
  });
});

app.post("/edit", (req, res) => {
  const oldFilePath = path.join(__dirname, "files", req.body.PreviousName);
  const newFilePath = path.join(__dirname, "files", req.body.NewName);

  fs.rename(oldFilePath, newFilePath, (err) => {
    if (err) {
      console.error("Error updating task:", err);
      return res.status(500).send("Internal Server Error");
    }
    res.redirect("/");
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
