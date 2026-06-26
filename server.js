const express = require('express');
const app = express();
const port = 3000;

let dailyColor;

function generateRandomColor() {
  dailyColor = {
    r: Math.floor(Math.random() * 256),
    g: Math.floor(Math.random() * 256),
    b: Math.floor(Math.random() * 256),
  };
}

// Generate the first color
generateRandomColor();

// Regenerate color every day
setInterval(generateRandomColor, 24 * 60 * 60 * 1000);

app.get('/daily', (req, res) => {
  res.json(dailyColor);
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
