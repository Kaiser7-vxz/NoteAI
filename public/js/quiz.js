let currentQuestions = [];

/* Mode Switch */
document.getElementById("mode").addEventListener("change", function() {
  const mode = this.value;
  document.getElementById("presetSection").classList.toggle("hidden", mode === "custom");
  document.getElementById("customSection").classList.toggle("hidden", mode === "preset");
});

/* Generate Quiz */
function generateQuiz() {

  const mode = document.getElementById("mode").value;
  const subject = document.getElementById("subject").value;
  const customTopic = document.getElementById("customTopic").value;
  const difficulty = document.getElementById("difficulty").value;
  const questionCount = parseInt(document.getElementById("questionCount").value);

  const topic = mode === "preset" ? subject : customTopic;

  if (!topic) {
    alert("Please enter a topic.");
    return;
  }

  fetch("/api/quiz", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      topic,
      difficulty,
      questionCount
    })
  })
  .then(res => res.json())
  .then(data => {
    currentQuestions = data.questions;
    displayQuiz();
  });
}

/* Display Quiz */
function displayQuiz() {

  const quizArea = document.getElementById("quizArea");
  quizArea.innerHTML = "";
  document.getElementById("result").innerHTML = "";

  currentQuestions.forEach((q, index) => {

    quizArea.innerHTML += `
      <div class="bg-white/10 backdrop-blur-lg border border-white/20 p-6 rounded-2xl shadow-lg">
        <p class="mb-4 font-semibold text-lg">${index + 1}. ${q.question}</p>

        ${q.options.map((opt, i) => `
          <label class="block mb-2 cursor-pointer">
            <input type="radio" name="q${index}" value="${i}" class="mr-2">
            ${opt}
          </label>
        `).join("")}
      </div>
    `;
  });

  document.getElementById("submitBtn").classList.remove("hidden");
}

/* Submit Quiz */
function submitQuiz() {

  let score = 0;

  currentQuestions.forEach((q, index) => {
    const selected = document.querySelector(`input[name="q${index}"]:checked`);
    if (selected && parseInt(selected.value) === q.answer) {
      score++;
    }
  });

  document.getElementById("result").innerHTML =
    `🎯 Your Score: ${score} / ${currentQuestions.length}`;

  document.getElementById("submitBtn").classList.add("hidden");
}