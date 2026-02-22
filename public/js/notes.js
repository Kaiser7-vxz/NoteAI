let currentNoteId = null;

/* LOAD NOTES */
function loadNotes(selectLast = false) {
  fetch("/api/notes")
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById("notesList");
      list.innerHTML = "";

      data.forEach((note, index) => {
        const isActive = currentNoteId === index;

        list.innerHTML += `
          <div onclick="openNote(${index})"
            class="p-3 rounded-xl cursor-pointer transition
            ${isActive ? "bg-indigo-600" : "bg-slate-700 hover:bg-slate-600"}">
            <h3 class="font-semibold truncate">${note.title}</h3>
            <p class="text-xs text-gray-300 mt-1">
              ${note.createdAt || ""}
            </p>
          </div>
        `;
      });

      // Auto select last note after creating
      if (selectLast && data.length > 0) {
        openNote(data.length - 1);
      }
    });
}

/* OPEN NOTE */
function openNote(id) {
  fetch("/api/notes")
    .then(res => res.json())
    .then(data => {
      const note = data[id];
      if (!note) return;

      currentNoteId = id;

      document.getElementById("title").value = note.title;
      document.getElementById("editor").innerHTML = note.content;
      document.getElementById("noteDate").innerText =
        "Created: " + (note.createdAt || "");

      loadNotes(); // refresh highlight
    });
}

/* CREATE NEW NOTE */
function newNote() {
  currentNoteId = null;
  document.getElementById("title").value = "";
  document.getElementById("editor").innerHTML = "";
  document.getElementById("noteDate").innerText = "";
}

/* SAVE NOTE */
function saveNote() {
  const title = document.getElementById("title").value || "Untitled";
  const content = document.getElementById("editor").innerHTML;

  const noteData = { title, content };

  // CREATE NEW NOTE
  if (currentNoteId === null) {
    fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(noteData)
    })
    .then(() => {
      loadNotes(true); // auto open last created
    });
  }

  // UPDATE EXISTING NOTE
  else {
    fetch("/api/notes/" + currentNoteId, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(noteData)
    })
    .then(() => {
      loadNotes();
    });
  }
}

/* DELETE NOTE */
function deleteNote() {
  if (currentNoteId === null) return;

  fetch("/api/notes/" + currentNoteId, {
    method: "DELETE"
  })
  .then(() => {
    newNote();
    loadNotes();
  });
}

/* INITIAL LOAD */
loadNotes();