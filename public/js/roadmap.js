let currentCareer = "";
let roadmapData = {};
let completedSkills = [];

/* Generate Roadmap */
function generateRoadmap() {

  const career = document.getElementById("careerSelect").value;

  if (!career) {
    alert("Please select a career.");
    return;
  }

  currentCareer = career;

  fetch("/api/career", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ career })
  })
  .then(res => res.json())
  .then(data => {
    roadmapData = data;
    completedSkills = JSON.parse(localStorage.getItem(career)) || [];
    renderRoadmap();
  });
}

/* Render Roadmap */
function renderRoadmap() {

  const container = document.getElementById("roadmapContainer");
  container.innerHTML = "";

  document.getElementById("progressContainer").classList.remove("hidden");

  roadmapData.stages.forEach((stage, stageIndex) => {

    container.innerHTML += `
      <div class="bg-white/10 backdrop-blur-lg border border-white/20 p-6 rounded-2xl shadow-lg">
        <div onclick="toggleStage(${stageIndex})"
          class="cursor-pointer text-xl font-semibold mb-4 flex justify-between items-center">
          ${stage.title}
          <span>▼</span>
        </div>

        <div id="stage-${stageIndex}" class="space-y-3 hidden">
          ${stage.skills.map(skill => `
            <div onclick="toggleSkill('${skill}')"
              class="skill-item p-3 rounded-xl cursor-pointer transition
              ${completedSkills.includes(skill)
                ? "bg-green-600"
                : "bg-slate-700 hover:bg-slate-600"}">
              ${skill}
            </div>
          `).join("")}
        </div>
      </div>
    `;
  });

  updateProgress();
}

/* Toggle Stage Expand */
function toggleStage(index) {
  document.getElementById(`stage-${index}`)
    .classList.toggle("hidden");
}

/* Toggle Skill Completion */
function toggleSkill(skill) {

  if (completedSkills.includes(skill)) {
    completedSkills = completedSkills.filter(s => s !== skill);
  } else {
    completedSkills.push(skill);
  }

  localStorage.setItem(currentCareer, JSON.stringify(completedSkills));

  renderRoadmap();
}

/* Update Progress */
function updateProgress() {

  const totalSkills = roadmapData.stages
    .reduce((acc, stage) => acc + stage.skills.length, 0);

  const percent = Math.round(
    (completedSkills.length / totalSkills) * 100
  );

  document.getElementById("progressBar").style.width = percent + "%";
}