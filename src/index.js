const express = require("express");
const csv = require("csv-parser");
const fs = require("fs");
const mysql = require("mysql2");
const upload = require("express-fileupload");
const app = express();
const results = [];
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "artJoker",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
app.use(upload());

fs.createReadStream(inputFilePath)
  .pipe(csv())
  .on("data", function(data) {
    try {
      //perform the operation
    } catch (err) {
      //error handler
    }
  })
  .on("end", function() {
    //some final operation
  });

app.post("/upload", async (req, res) => {
  const { mimetype, name } = req.files.file;
  if (mimetype !== "text/csv") return res.sendStatus(415);
  fs.createReadStream("./src/base.csv")
    .pipe(csv(["username", "firstname", "lastname", "age"]))
    .on("data", data => results.push(data))
    .on("end", () => {
      for (let key in results) {
        pool.query(
          `INSERT INTO users (username, firstname, lastname, age) VALUES ("${results[key].username}","${results[key].firstname}","${results[key].lastname}","${results[key].age}" )`,
          function(err, rows, fields) {}
        );
      }
    });

  return res.send(`File uploaded`);
});

app.get("/all_users", (req, res) => {
  pool.query(`SELECT username, firstname, lastname, age FROM users`, function(
    err,
    rows,
    fields
  ) {
    return res.send(JSON.stringify(rows));
  });
});

app.listen(3000, () => console.log(`server is started: localhost:3000`));

// req.files.file.mv(`./uploads/${name}`, err => {
//   if (err) {
//     return res.send(err);
//   } else {
