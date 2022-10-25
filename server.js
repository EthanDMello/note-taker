const express = require("express");
const path = require("path");
const fs = require("fs");
// const util = require("util");

// Helper method for generating unique ids
// const uuid = require("./helpers/uuid");

const PORT = 3001;

const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

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

const writeToFile = (destination, content) =>
  fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
    err ? console.error(err) : console.info(`\nData written to ${destination}`)
  );

// GET Route for homepage
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);

// GET Route for feedback page
app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/notes.html"))
);

// Promise version of fs.readFile
// const readFromFile = util.promisify(fs.readFile);

// GET Route for retrieving all the feedback
app.get("/api/notes", (req, res) => {
  //   console.info(`${req.method} request received for feedback`);

  fs.readFile("./db/db.json", (err, note) => {
    if (err) console.log("error reading file.");
    res.json(JSON.parse(note));
  });
  //   readFromFile("./db/db.json").then((data) => res.json(JSON.parse(data)));
});

app.post("/api/notes", (req, res) => {
  console.log(req.body);

  readAndAppend(req.body, "./db/db.json");
});

app.delete(`/api/notes/:id`, async (req, res) => {
  try {
    id = req.params.id;
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
    console.log(dataBase);

    let index = 0;
    for (i of dataBase) {
      const d = JSON.stringify(i);
      newId = JSON.stringify(id);
      newIndex = JSON.stringify(d);
      if (newIndex === newId) {
        console.log(i, index, "<---- THIS IS THE SELECTED DATA!");
        dataBase.splice(index, 1);
        console.log(dataBase);
      }
      index++;
    }
  } catch (err) {
    console.log(err);
    return;
  }
});
// POST Route for submitting feedback
// app.post("/api/notes", (req, res) => {
//   // Log that a POST request was received
//   console.info(`${req.method} request received to submit feedback`);

//   // Destructuring assignment for the items in req.body
//   const { email, feedbackType, feedback } = req.body;

//   // If all the required properties are present
//   if (email && feedbackType && feedback) {
//     // Variable for the object we will save
//     const newFeedback = {
//       email,
//       feedbackType,
//       feedback,
//       feedback_id: uuid(),
//     };

//     readAndAppend(newFeedback, "./db/feedback.json");

//     const response = {
//       status: "success",
//       body: newFeedback,
//     };

//     res.json(response);
//   } else {
//     res.json("Error in posting feedback");
//   }
// });

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
