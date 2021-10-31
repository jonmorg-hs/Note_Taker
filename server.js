// Import Dependencies
const express = require("express");
const path = require("path");
const fs = require("fs");

// Setup Express Variables
const app = express();
const port = process.env.port || 3000;
// Allow Access to public folder
app.use(express.static("public"));
//Allow reading of JSON files
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Express GET Routes
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "public/index.html"));
});
app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "public/notes.html"));
});
app.get("/api/notes/", function (req, res) {
  // Read db file
  fs.readFile(__dirname + "/db/db.json", (err, data) => {
    // Parse db file
    var json = JSON.parse(data);
    return res.json(json);
  });
});

// Setup default index.html
app.get("*", function (req, res) {
  res.sendFile(__dirname + "/public/index.html");
});

// Express POST Routes
app.post("/api/notes/", function (req, res) {
  newNote = req.body;
  // Get and Parse db file
  fs.readFile(__dirname + "/db/db.json", (err, data) => {
    var json = JSON.parse(data);
    // Push new note
    json.push(newNote);
    // Write db file with new note
    fs.writeFileSync(__dirname + "/db/db.json", JSON.stringify(json));
  });
});

// Express DELETE Routes
app.delete("/api/notes/:id", function (req, res) {
  // Get note id to be deleted from our request parameter (:id)
  let response = req.params;
  let id = response.id;
  console.log(`Note id: ${id} marked for deletion`);
  // Read db file
  fs.readFile(__dirname + "/db/db.json", (err, data) => {
    // Parse db file
    var json = JSON.parse(data);
    // Filter data with new array of objects without the note containing the id
    const filteredJson = json.filter((element) => element.id !== id);
    // Write db file
    fs.writeFileSync(__dirname + "/db/db.json", JSON.stringify(filteredJson));
  });
});

// Express Server
// Listening on port 3000
app.listen(process.env.PORT || 3000, () => {
  console.log(`Started server`);
});
