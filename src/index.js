"use strict";

import { registerImage } from "./lazy";

const streamersNode = document.querySelector("#streamers");
const btnGetStreamer = document.querySelector("#get-streamer");
const puzzlesNode = document.querySelector("#puzzles");

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

async function getRandomPuzzle() {
  const response = await fetch("https://api.chess.com/pub/puzzle/random");
  return await response.json();
}

async function getPuzzleProp(puzzle, prop) {
  const response = await puzzle;
  return response[prop];
}

async function getStreamerList() {
  const response = await fetch("https://api.chess.com/pub/streamers");
  return await response.json();
}

async function getRandomStreamer() {
  const response = await getStreamerList();
  const streamers = response.streamers;
  const ran = getRandomInt(0, streamers.length);
  return streamers[ran];
}

function createImageNode(src, alt, width) {
  const container = document.createElement("div");
  container.classList.add("p-4");

  const image = document.createElement("img");
  image.classList.add("mx-auto");
  image.width = width;
  image.dataset.src = src;
  image.dataset.alt = alt;

  container.appendChild(image);

  return container;
}

async function displayRandomStreamer() {
  const streamer = await getRandomStreamer();
  // data
  const avatar = streamer.avatar;
  const username = streamer.username;
  const url = streamer.url;

  // dom
  const div = document.createElement("div");
  const a = document.createElement("a");
  a.href = url;
  a.target = "_blank";
  const img = createImageNode(avatar, `${username}'s Chess.com profile`, 100);
  const p = document.createElement("p");
  p.textContent = username;
  streamersNode.appendChild(div);
  div.appendChild(a);
  a.appendChild(img);
  registerImage(img);
  div.appendChild(p);
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
        "Random daily puzzle from chess.com",
        400
      );
      puzzlesNode.appendChild(image);
      registerImage(image);

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

btnGetStreamer.addEventListener("click", displayRandomStreamer);

displayRandomStreamer();
displayPuzzles(1, 0);
displayPuzzles(50, 15000);
