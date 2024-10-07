const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3002;

const db = new sqlite3.Database("./book.db", (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Connected to the book database");
});

app.use(cors());

app.use(express.json());

app.get("/books", (req, res) => {
  db.all("SELECT * FROM booklist", (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).send("Internal server error");
    } else {
      res.send(rows);
    }
  });
});

app.post("/books", (req, res) => {
  const { author, title, pubYear, isbn, img } = req.body;
  const sql =
    "INSERT INTO booklist(author, title, pubYear, isbn, img) VALUES (?, ?, ?, ?, ?)";
  db.run(sql, [author, title, pubYear, isbn, img], function (err) {
    if (err) {
      console.error(err.message);
      res.status(500).send("Internal server error");
    } else {
      const id = this.lastID;
      res.status(201).send({ id, author, title, pubYear, isbn, img });
    }
  });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}.`);
});
