"use strict";

import { registerImage } from "./lazy.js";

const streamersNode = document.querySelector("#streamers");
const btnGetStreamer = document.querySelector("#get-streamer");
const btnStreamersCleaner = document.querySelector("#streamer-cleaner");
const puzzlesNode = document.querySelector("#puzzles");

let totalImg = 0;
let totalLoaded = 0;

function addTotalImg(num = 1) {
  totalImg += num;
}

export function addTotalLoaded(num = 1) {
  totalLoaded += num;
}

export function showImageStats() {
  console.log(`⚪️ Total images: ${totalImg}`);
  console.log(`🟣 Loaded images: ${totalLoaded}`);
  console.log(
    "----------------------------------------------------------------"
  );
}

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

function createImageNode(src, alt, width, height) {
  const container = document.createElement("div");
  container.classList.add("p-4");

  const image = document.createElement("img");
  image.classList.add("mx-auto", "gray-bg");
  image.width = width;
  image.height = height;
  image.dataset.src = src;
  image.dataset.alt = alt;

  container.appendChild(image);

  addTotalImg();
  showImageStats();

  return container;
}

async function displayRandomStreamer() {
  const streamer = await getRandomStreamer();
  // data
  const avatar = streamer.avatar;
  const username = streamer.username;
  const url = streamer.url;

  // dom
  const image = createImageNode(
    avatar,
    `${username}'s Chess.com profile`,
    100,
    100
  );
  image.classList.add("card");
  const img = image.querySelector("img");
  const a = document.createElement("a");
  a.href = url;
  a.target = "_blank";
  const p = document.createElement("p");
  p.textContent = username;
  streamersNode.appendChild(image);
  image.appendChild(a);
  a.appendChild(img);
  image.appendChild(p);
  registerImage(image);
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
        400,
        400
      );
      image.classList.add("card");
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

function cleanOfCards(node) {
  const children = [...node.children];
  children.forEach((child) => {
    const classes = [...child.classList];
    if (classes.includes("card")) {
      const img = child.querySelector("img");
      if (img.src) addTotalLoaded(-1);
      addTotalImg(-1);
      showImageStats();
      child.remove();
    }
  });
}

btnGetStreamer.addEventListener("click", displayRandomStreamer);
btnStreamersCleaner.addEventListener("click", () => {
  cleanOfCards(streamersNode);
});

displayRandomStreamer();
displayPuzzles(1, 0);
displayPuzzles(50, 15000);
