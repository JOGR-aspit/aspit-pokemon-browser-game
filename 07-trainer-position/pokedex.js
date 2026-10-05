"use strict";

const filterRegion = document.querySelector("#pokedex-filter");
const typeFilter = document.querySelector("#type-filter");
const filterStatus = document.querySelector("#filter-status");
const pokemonEntries = document.querySelectorAll(".pokedex-entry");

if (
  !filterRegion
  || !typeFilter
  || !filterStatus
  || pokemonEntries.length === 0
) {
  throw new Error("Required Pokédex filter elements are missing.");
}

function updatePokedex() {
  const selectedType = typeFilter.value;
  let visibleCount = 0;

  for (const entry of pokemonEntries) {
    const entryTypes = entry.dataset.types.split(" ");
    const matchesType =
      selectedType === "all" || entryTypes.includes(selectedType);

    entry.hidden = !matchesType;

    if (matchesType) {
      visibleCount += 1;
    }
  }

  filterStatus.textContent =
    `Showing ${visibleCount} of ${pokemonEntries.length} Pokémon.`;
}

typeFilter.value = "all";
typeFilter.addEventListener("change", updatePokedex);
updatePokedex();
filterRegion.hidden = false;
