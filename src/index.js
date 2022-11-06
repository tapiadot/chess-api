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

function createImageNode(src, alt) {
  const container = document.createElement("div");
  container.classList.add("p-4");

  const image = document.createElement("img");
  image.classList.add("mx-auto");
  image.width = "400";
  image.src = src;
  image.alt = alt;

  container.appendChild(image);

  return container;
}

async function displayPuzzles(num, delay) {
  let counter = 0;
  const loop = () => {
    setTimeout(async () => {
      // puzzle info
      const puzzle = await getRandomPuzzle();
      const puzzleImg = await getPuzzleProp(puzzle, "image");
      const puzzleDesc = await getPuzzleProp(puzzle, "title");

      // img
      const image = createImageNode(
        puzzleImg,
        "Random daily puzzle from chess.com"
      );
      puzzlesNode.appendChild(image);

      // desc
      const p = document.createElement("p");
      p.textContent = puzzleDesc;
      image.insertBefore(p, image.firstChild);

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
