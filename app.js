const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const request = require("request");
const rp = require("request-promise");

const port = "3000";
const host = "localhost";

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

// =========================
// ROUTES
// =========================

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/results/", (req, res) => {
  var query = req.query["search"];
  const url = `http://www.omdbapi.com/?s=${query}&apikey=thewdb`;

  request(url, (err, _res, body) => {
    if (err) {
      console.log(`Something went wrong\n${err}`);
      res.render("something-went-wrong", { error: err });
    } else {
      if (res.statusCode === 200) {
        var data = JSON.parse(body);
        if (data["Response"] === "False") {
          // data = { Response: 'False', Error: 'Movie not found!' }
          res.render("not-found", { query: query });
        } else {
          console.log(data);
          res.render("results", { data: data });
        }
      } else {
        console.log(`Status Code: ${res.statusCode}`);
      }
    }
  });
});

app.get("/results-using-promise/", (req, res) => {
  var query = req.query["search"];
  const url = `http://www.omdbapi.com/?s=${query}&apikey=thewdb`;

  rp(url)
    .then((body) => {
      var data = JSON.parse(body);
      if (data["Response"] === "False") {
        // data = { Response: 'False', Error: 'Movie not found!' }
        res.render("not-found", { query: query });
      } else {
        res.render("results", { data: data });
      }
    })
    .catch((err) => {
      console.log(`Something went wrong\n${err}`);
      res.render("something-went-wrong", { error: err });
    });
});

// =========================

app.listen(port, host, () => {
  console.log(`Server has started on http://${host}:${port}/`);
});
