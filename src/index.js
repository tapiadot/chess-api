"use strict";

const puzzlesNode = document.querySelector("#puzzles");

async function getRandomPuzzle() {
  const response = await fetch("https://api.chess.com/pub/puzzle/random");
  return await response.json();
}

async function getPuzzleProp(puzzle, prop) {
  const response = await puzzle;
  return response[prop];
}

async function displayPuzzles(num, delay) {
  let counter = 0;
  const loop = () => {
    setTimeout(async () => {
      // puzzle info
      const puzzle = await getRandomPuzzle();
      const puzzleImg = await getPuzzleProp(puzzle, "image");
      const puzzleDesc = await getPuzzleProp(puzzle, "title");

      // dom
      const div = document.createElement("div");
      const p = document.createElement("p");
      const img = document.createElement("img");
      puzzlesNode.appendChild(div);
      div.appendChild(p);
      div.appendChild(img);

      // add info
      div.classList.add("p-4");
      p.textContent = puzzleDesc;
      img.src = puzzleImg;
      img.alt = "Random daily puzzle from chess.com";
      img.classList.add("mx-auto");

      counter++;
      if (counter < num) {
        loop();
      }
    }, delay);
  };
  loop();
}

displayPuzzles(1, 0);
displayPuzzles(20, 15000);
