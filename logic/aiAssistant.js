const fs = require("fs");

function reply(message) {
  const knowledge = JSON.parse(
    fs.readFileSync("./data/knowledge.json", "utf8")
  );

  message = message.toLowerCase();

  let bestMatch = null;
  let highestScore = 0;

  knowledge.forEach(item => {
    let score = 0;

    item.keywords.forEach(keyword => {
      if (message.includes(keyword)) {
        score++;
      }
    });

    if (score > highestScore) {
      highestScore = score;
      bestMatch = item;
    }
  });

  if (bestMatch) {
    return bestMatch.answer;
  }

  return generateSmartFallback(message);
}

function generateSmartFallback(message) {
  if (message.includes("how")) {
    return "To solve this, break the topic into smaller parts and understand the core concept step by step.";
  }

  if (message.includes("what")) {
    return "This topic relates to computer science fundamentals. Try being more specific.";
  }

  return "I am still learning. Try asking about programming, web development, or study tips.";
}

module.exports = { reply };