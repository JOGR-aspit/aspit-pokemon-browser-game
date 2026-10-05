"use strict";

const starterDefinitions = [
  {
    id: "snivy",
    name: "Snivy",
    type: "Grass",
    maximumHitPoints: 40,
  },
  {
    id: "fuecoco",
    name: "Fuecoco",
    type: "Fire",
    maximumHitPoints: 40,
  },
  {
    id: "totodile",
    name: "Totodile",
    type: "Water",
    maximumHitPoints: 40,
  },
];

const terrainDefinitions = [
  {
    id: "center",
    name: "Pokémon Center",
    symbol: "C",
  },
  {
    id: "path",
    name: "Path",
    symbol: "P",
  },
  {
    id: "grass",
    name: "Tall grass",
    symbol: "G",
  },
  {
    id: "blocked",
    name: "Blocked terrain",
    symbol: "X",
  },
];

const startingPosition = {
  row: 2,
  column: 2,
};

const mapTiles = [
  { row: 0, column: 0, terrain: "blocked" },
  { row: 0, column: 1, terrain: "grass" },
  { row: 0, column: 2, terrain: "grass" },
  { row: 0, column: 3, terrain: "path" },
  { row: 0, column: 4, terrain: "blocked" },
  { row: 1, column: 0, terrain: "path" },
  { row: 1, column: 1, terrain: "path" },
  { row: 1, column: 2, terrain: "grass" },
  { row: 1, column: 3, terrain: "path" },
  { row: 1, column: 4, terrain: "grass" },
  { row: 2, column: 0, terrain: "grass" },
  { row: 2, column: 1, terrain: "path" },
  { row: 2, column: 2, terrain: "center" },
  { row: 2, column: 3, terrain: "path" },
  { row: 2, column: 4, terrain: "grass" },
  { row: 3, column: 0, terrain: "grass" },
  { row: 3, column: 1, terrain: "path" },
  { row: 3, column: 2, terrain: "path" },
  { row: 3, column: 3, terrain: "path" },
  { row: 3, column: 4, terrain: "grass" },
  { row: 4, column: 0, terrain: "blocked" },
  { row: 4, column: 1, terrain: "grass" },
  { row: 4, column: 2, terrain: "grass" },
  { row: 4, column: 3, terrain: "path" },
  { row: 4, column: 4, terrain: "blocked" },
];

const state = {
  trainerName: "",
  starter: null,
  mapPosition: null,
  activeEncounter: null,
  caughtPokemon: [],
  statusMessage: "Enter a fictional trainer name and choose a starter.",
};

const trainerForm = document.querySelector("#trainer-form");
const trainerNameInput = document.querySelector("#trainer-name");
const trainerNameError = document.querySelector("#trainer-name-error");
const starterChoice = document.querySelector("#starter-choice");
const starterError = document.querySelector("#starter-error");
const trainerOutput = document.querySelector("#trainer-output");
const starterOutput = document.querySelector("#starter-output");
const hitPointsOutput = document.querySelector("#hit-points-output");
const positionOutput = document.querySelector("#position-output");
const encounterOutput = document.querySelector("#encounter-output");
const caughtOutput = document.querySelector("#caught-output");
const gameStatus = document.querySelector("#game-status");
const overworldMap = document.querySelector("#overworld-map");

if (
  !trainerForm
  || !trainerNameInput
  || !trainerNameError
  || !starterChoice
  || !starterError
  || !trainerOutput
  || !starterOutput
  || !hitPointsOutput
  || !positionOutput
  || !encounterOutput
  || !caughtOutput
  || !gameStatus
  || !overworldMap
) {
  throw new Error("Required game elements are missing.");
}

function findStarterDefinition(starterId) {
  for (const starterDefinition of starterDefinitions) {
    if (starterDefinition.id === starterId) {
      return starterDefinition;
    }
  }

  return null;
}

function findTerrainDefinition(terrainId) {
  for (const terrainDefinition of terrainDefinitions) {
    if (terrainDefinition.id === terrainId) {
      return terrainDefinition;
    }
  }

  return null;
}

function findMapTile(row, column) {
  for (const mapTile of mapTiles) {
    if (mapTile.row === row && mapTile.column === column) {
      return mapTile;
    }
  }

  return null;
}

function renderMap() {
  overworldMap.replaceChildren();

  for (const mapTile of mapTiles) {
    const terrainDefinition = findTerrainDefinition(mapTile.terrain);

    if (terrainDefinition === null) {
      throw new Error(`Unknown terrain: ${mapTile.terrain}`);
    }

    const trainerHere =
      state.mapPosition !== null
      && mapTile.row === state.mapPosition.row
      && mapTile.column === state.mapPosition.column;
    const tileElement = document.createElement("li");
    const visibleRow = mapTile.row + 1;
    const visibleColumn = mapTile.column + 1;
    const tileName =
      `Row ${visibleRow}, column ${visibleColumn}: ${terrainDefinition.name}.`;

    tileElement.setAttribute(
      "class",
      `map-tile map-tile--${mapTile.terrain}`,
    );
    tileElement.setAttribute("aria-label", tileName);
    tileElement.textContent = terrainDefinition.symbol;

    if (trainerHere) {
      tileElement.setAttribute("aria-label", `${tileName} Trainer here.`);
      const trainerImage = document.createElement("img");
      trainerImage.setAttribute("class", "trainer-sprite");
      trainerImage.setAttribute("src", "assets/trainer.png");
      trainerImage.setAttribute("alt", "");
      tileElement.append(trainerImage);
    }

    overworldMap.append(tileElement);
  }
}

function renderGame() {
  if (state.starter === null || state.mapPosition === null) {
    trainerOutput.textContent = "No trainer yet.";
    starterOutput.textContent = "No starter selected.";
    hitPointsOutput.textContent = "Not available.";
    positionOutput.textContent = "Not set.";
  } else {
    trainerOutput.textContent = state.trainerName;
    starterOutput.textContent = `${state.starter.name} — ${state.starter.type}`;
    hitPointsOutput.textContent =
      `${state.starter.currentHitPoints} of ${state.starter.maximumHitPoints}`;

    const currentTile = findMapTile(
      state.mapPosition.row,
      state.mapPosition.column,
    );

    if (currentTile === null) {
      throw new Error(
        `No map tile at row ${state.mapPosition.row}, column ${state.mapPosition.column}.`,
      );
    }

    const currentTerrain = findTerrainDefinition(currentTile.terrain);

    if (currentTerrain === null) {
      throw new Error(`Unknown terrain: ${currentTile.terrain}`);
    }

    const visibleRow = state.mapPosition.row + 1;
    const visibleColumn = state.mapPosition.column + 1;

    positionOutput.textContent =
      `${currentTerrain.name} — row ${visibleRow}, column ${visibleColumn}`;
  }

  if (state.activeEncounter === null) {
    encounterOutput.textContent = "No active encounter.";
  } else {
    encounterOutput.textContent = state.activeEncounter.name;
  }

  caughtOutput.textContent = `${state.caughtPokemon.length}`;
  gameStatus.textContent = state.statusMessage;
  renderMap();
}

function handleTrainerSubmit(event) {
  event.preventDefault();

  trainerNameInput.removeAttribute("aria-invalid");
  starterChoice.removeAttribute("aria-invalid");
  trainerNameError.textContent = "";
  starterError.textContent = "";

  const trainerName = trainerNameInput.value.trim();
  const starterId = starterChoice.value;

  if (trainerName === "") {
    trainerNameInput.setAttribute("aria-invalid", "true");
    trainerNameError.textContent = "Enter a fictional trainer name.";
    trainerNameInput.focus();
    return;
  }

  if (starterId === "") {
    starterChoice.setAttribute("aria-invalid", "true");
    starterError.textContent = "Choose a starter Pokémon.";
    starterChoice.focus();
    return;
  }

  const starterDefinition = findStarterDefinition(starterId);

  if (starterDefinition === null) {
    starterChoice.setAttribute("aria-invalid", "true");
    starterError.textContent = "Choose a listed starter Pokémon.";
    starterChoice.focus();
    return;
  }

  state.trainerName = trainerName;
  state.starter = {
    id: starterDefinition.id,
    name: starterDefinition.name,
    type: starterDefinition.type,
    currentHitPoints: starterDefinition.maximumHitPoints,
    maximumHitPoints: starterDefinition.maximumHitPoints,
  };
  state.mapPosition = {
    row: startingPosition.row,
    column: startingPosition.column,
  };
  state.activeEncounter = null;
  state.caughtPokemon = [];
  state.statusMessage =
    `${trainerName} and ${starterDefinition.name} are ready to explore.`;

  renderGame();
}

trainerForm.addEventListener("submit", handleTrainerSubmit);

renderGame();
