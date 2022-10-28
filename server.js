const express = require("express");
const path = require("path");
const fs = require("fs");

const PORT = process.env.PORT || 3001;

const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

// adding content to end of file
const readAndAppend = (content, file) => {
  fs.readFile(file, "utf8", (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const parsedData = JSON.parse(data);
      parsedData.push(content);
      writeToFile(file, parsedData);
    }
  });
};

// Rewriting whole file - for deleting notes
const writeToFile = (destination, content) =>
  fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
    err ? console.error(err) : console.info(`\nData written to ${destination}`)
  );

// GET Route for landing page
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);

// GET Route for notes page
app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/notes.html"))
);

// GET Route for retrieving all the notes
app.get("/api/notes", (req, res) => {
  fs.readFile("./db/db.json", (err, note) => {
    if (err) console.log("error reading file.");
    res.json(JSON.parse(note));
  });
});

// POST Route for adding/saving new note
app.post("/api/notes", (req, res) => {
  console.log("calling notes post", req.body);

  readAndAppend(req.body, "./db/db.json");
  res.json(JSON.stringify(req.body));
});

// DELETE Route for deleting single note
app.delete(`/api/notes/:id`, async (req, res) => {
  try {
    id = req.body;
    console.log("deleting database id:", id);

    const newDataBase = fs.readFileSync(
      "./db/db.json",
      "UTF-8",
      (err, note) => {
        if (err) return err;
        return note;
      }
    );

    dataBase = JSON.parse(newDataBase);

    let index = 0;
    for (i of dataBase) {
      const d = JSON.stringify(i);
      newId = JSON.stringify(id);
      if (d === newId) {
        console.log(i, index, "<---- THIS IS THE SELECTED DATA!");
        dataBase.splice(index, 1);
        console.log(dataBase);
        writeToFile("./db/db.json", dataBase);
      }
      index++;
    }
    console.log(JSON.stringify(dataBase));
    res.json(dataBase);
  } catch (err) {
    console.log(err, "DELETE ERROR");
    return;
  }
});

// running express
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
