function send() {
  const input = document.getElementById("message");
  const message = input.value.trim();
  const chat = document.getElementById("chat");

  if (!message) return;

  // Show user message
  chat.innerHTML += `
    <div class="bg-slate-700 p-3 rounded-xl fade-in">
      <b>You:</b> ${message}
    </div>
  `;

  input.value = "";
  chat.scrollTop = chat.scrollHeight;

  // Show thinking animation
  const thinkingId = "thinking-" + Date.now();

  chat.innerHTML += `
    <div id="${thinkingId}" class="bg-indigo-600 p-3 rounded-xl fade-in">
      <b>AI:</b> Thinking
      <div class="typing inline-block ml-2">
        <span></span><span></span><span></span>
      </div>
    </div>
  `;

  chat.scrollTop = chat.scrollHeight;

  // Simulate thinking delay
  setTimeout(() => {
    fetch("/api/assistant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    })
    .then(res => res.json())
    .then(data => {

      // Remove thinking animation
      const thinkingElement = document.getElementById(thinkingId);
      if (thinkingElement) thinkingElement.remove();

      // Show AI response
      chat.innerHTML += `
        <div class="bg-indigo-600 p-3 rounded-xl fade-in">
          <b>AI:</b> ${data.response}
        </div>
      `;

      chat.scrollTop = chat.scrollHeight;
    })
    .catch(err => {
      console.error(err);
      alert("Server error");
    });

  }, 1000);
}

// Press Enter to send
document.getElementById("message").addEventListener("keypress", function(e) {
  if (e.key === "Enter") {
    send();
  }
});