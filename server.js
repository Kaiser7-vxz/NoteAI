const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();
app.use(bodyParser.json());
app.use(express.static("public"));

const aiAssistant = require("./logic/aiAssistant");
const adaptiveQuiz = require("./logic/adaptiveQuiz");
const careerEngine = require("./logic/careerEngine");

/* ================= FILE HELPERS ================= */

function read(file) {
  try {
    return JSON.parse(fs.readFileSync(`./data/${file}`, "utf8"));
  } catch (err) {
    return [];
  }
}

function write(file, data) {
  fs.writeFileSync(`./data/${file}`, JSON.stringify(data, null, 2));
}

/* ================= NOTES API ================= */

/* GET ALL NOTES */
app.get("/api/notes", (req, res) => {
  res.json(read("notes.json"));
});

/* CREATE NOTE */
app.post("/api/notes", (req, res) => {
  const notes = read("notes.json");

  const newNote = {
    title: req.body.title || "Untitled",
    content: req.body.content || "",
    createdAt: new Date().toLocaleString()
  };

  notes.push(newNote);
  write("notes.json", notes);

  res.json({ message: "Note created" });
});

/* UPDATE NOTE */
app.put("/api/notes/:id", (req, res) => {
  const notes = read("notes.json");
  const id = parseInt(req.params.id);

  if (!notes[id]) {
    return res.status(404).json({ message: "Note not found" });
  }

  notes[id] = {
    ...notes[id],
    title: req.body.title,
    content: req.body.content
  };

  write("notes.json", notes);
  res.json({ message: "Note updated" });
});

/* DELETE NOTE */
app.delete("/api/notes/:id", (req, res) => {
  const notes = read("notes.json");
  const id = parseInt(req.params.id);

  if (!notes[id]) {
    return res.status(404).json({ message: "Note not found" });
  }

  notes.splice(id, 1);
  write("notes.json", notes);

  res.json({ message: "Note deleted" });
});

/* ================= OTHER FEATURES ================= */

/* ASSISTANT */
app.post("/api/assistant", (req, res) => {
  res.json({ response: aiAssistant.reply(req.body.message) });
});

/* QUIZ */
app.post("/api/quiz", (req, res) => {
  const { topic, difficulty, questionCount } = req.body;

  res.json(
    adaptiveQuiz.generate(topic, difficulty, questionCount)
  );
});
/* CAREER */
app.post("/api/career", (req, res) => {
  const { career } = req.body;

  res.json(careerEngine.generate(career));
});

/* COURSES */
app.get("/api/courses", (req, res) => {
  res.json(read("courses.json"));
});
/* ================= SERVER ================= */

app.listen(3000, () => {
  console.log(" NoteAI is running on http://localhost:3000");
});