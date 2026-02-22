function loadCourses() {

  const category = document.getElementById("category").value;
  const search = document.getElementById("searchInput").value.toLowerCase();

  fetch("/api/courses")
    .then(res => res.json())
    .then(data => {

      const container = document.getElementById("courseContainer");
      container.innerHTML = "";

      let courses = [];

      if (category === "all") {
        Object.values(data).forEach(cat => {
          courses = courses.concat(cat);
        });
      } else {
        courses = data[category] || [];
      }

      // Search filter
      courses = courses.filter(course =>
        course.title.toLowerCase().includes(search)
      );

      if (courses.length === 0) {
        container.innerHTML = "<p class='text-gray-400'>No courses found.</p>";
        return;
      }

      courses.forEach(course => {

        container.innerHTML += `
          <div class="bg-slate-800 p-6 rounded-2xl shadow-lg hover:scale-105 transition">
            
            <h3 class="text-xl font-semibold mb-2">${course.title}</h3>
            <p class="text-gray-400 text-sm mb-3">${course.description}</p>

            <div class="text-sm mb-2">Level: ${course.level}</div>
            <div class="text-sm mb-2">Duration: ${course.duration}</div>
            <div class="text-sm mb-4">Modules: ${course.modules.length}</div>

            <button 
              onclick='showDetails(${JSON.stringify(course)})'
              class="bg-indigo-600 px-4 py-2 rounded-xl hover:bg-indigo-700 transition">
              View Details
            </button>

          </div>
        `;
      });

    });
}

function showDetails(course) {

  let moduleList = "";
  course.modules.forEach(m => {
    moduleList += `<li class="mb-1">• ${m}</li>`;
  });

  let projectList = "";
  course.projects.forEach(p => {
    projectList += `<li class="mb-1">• ${p}</li>`;
  });

  const container = document.getElementById("courseContainer");

  container.innerHTML = `
    <div class="bg-slate-800 p-8 rounded-2xl shadow-lg">
      
      <button onclick="loadCourses()" class="mb-6 bg-gray-600 px-4 py-2 rounded-xl">
        ← Back
      </button>

      <h2 class="text-3xl font-bold mb-4">${course.title}</h2>
      <p class="text-gray-400 mb-4">${course.description}</p>

      <div class="mb-4">
        <strong>Level:</strong> ${course.level}
      </div>

      <div class="mb-4">
        <strong>Duration:</strong> ${course.duration}
      </div>

      <h3 class="text-xl font-semibold mt-6 mb-3">Modules</h3>
      <ul>${moduleList}</ul>

      <h3 class="text-xl font-semibold mt-6 mb-3">Projects</h3>
      <ul>${projectList}</ul>

      <h3 class="text-xl font-semibold mt-6 mb-3">Career Opportunities</h3>
      <p>${course.career}</p>

    </div>
  `;
}

loadCourses();