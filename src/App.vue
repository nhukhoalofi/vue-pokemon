<script setup>
import { ref } from 'vue'
const offset = ref(0);
const numberOfRender = ref(36);
const all_pkm = ref([]);
const filtered_pkm = ref([]);
const htmlPokemon = ref('');
async function fetchAPI (url) {
    const response = await fetch(url);
    const data = await response.json();
    return data;
};

async function getPokemon() {
    const data = await fetchAPI('https://pokeapi.co/api/v2/pokemon/?offset=0&limit=898');
    all_pkm.value = data.results;
    filtered_pkm.value = all_pkm.value;

    renderPokemon();
}
getPokemon();
function getIDPokemon(url) {
    const parts = url.split('/');
    return parseInt(parts[parts.length - 2], 10);
}
const renderPokemon = () => {
  let html = ''
  
  for (let index = offset.value; index < offset.value + numberOfRender.value && index < filtered_pkm.value.length; index++) {
    const pokemon = filtered_pkm.value[index]
    const ID = getIDPokemon(pokemon.url)

    html += `
      <div class="pokemon-item">
        <div class="pokemon-id">#${ID}</div>
        <div class="pokemon-image">
          <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${ID}.png" alt="${pokemon.name}">
        </div>
        <div class="pokemon-name">${pokemon.name}</div>
      </div>
    `;
  }

  htmlPokemon.value += html;
  offset.value += numberOfRender.value;
}
</script>

<template>
  <div class="container">
        <h1>Pokemon API</h1>
        <div class="search-container">
            <input type="text" id="search" placeholder="Search some Pokemon..." />
        </div>
        <div id="app" v-html="htmlPokemon"></div>
        <button class="dl" @click="renderPokemon">Load More</button>
    </div>

</template>
<style>
body {
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
    overflow-y: auto; 
}

.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    padding: 20px;
    box-sizing: border-box;
}
#app {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    width: 1400px;
    gap: 10px;
}
.type {
    display:flex;   
    justify-self: center;
    padding: 2px 2px;
    gap:2px;
    border-radius: 5px;
    color: black;
}
input {
    box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.2);
    border-radius: 20px;
    width: 330px;
    height: 40px;
    border: 1px solid #c2c2c2;
    padding: 5px 10px;
    outline: none;
}
.pokemon-item {
    box-shadow: 2px 2px 2px 2px #f2f2f2;
    width: 180px;
    height:279px;
    margin: 10px;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 15px;
    background-color: white;
    display: inline-block;
    text-align: center;
    transition: transform 0.3s ease;
}
.pokemon-id {
    font-size: 14px;
    color: #777;
}

.pokemon-item img {
    width: 100%;
    height: 180px;
    object-fit: contain;
    margin-bottom: 10px;
}

.pokemon-item h3 {
    font-size: 16px;
    margin: 0;
}
button {
    color: #ffffff;
    background-color: #ff4d4f;
    border: none;
    border-radius: 3px;
    height: 60px;
    width:124px;
}
.pokemon-item:hover {
    box-shadow: 2px 2px 2px 2px 
    #dfdfdf
}
.type.fire {
    background-color: #ec421f;
}
.type.grass {
    background-color: #77cc54;
}
.type.flying {
    background-color: #9e87e1;
}
.type.poison {
    background-color:#a33ea1;
}
.type.water {
    background-color: #6390f0;
}
.type.bug {
    background-color: #a6b91a;
}
.type.normal{
    background-color: #a8a77a;
}
.type.fairy {
    background-color: #d685ad;
}
.type.ground {
    background-color: #e2bf65;
}
.type.electric {
    background-color: #f7d02c;
}
.type.ghost {
    background-color: #735797;
}
.type.ice {
    background-color: #96d9d6;
}
.type.psychic {
    background-color: #f95587;
}
.type.fighting {
    background-color: #f95587;
}
.type.rock {
    background-color: #b5a036;
}
.type.steel {
    background-color: #b7b7ce;
}
.type.dragon {
    background-color: #6f35fc;
}
.type.dark {
    background-color: #645244;
}
@media screen and (max-width: 1600px) {
    .pokemon-item {
        width:150px;
    }
}
@media screen and (max-width: 1200px) {
    #app {
        width: 900px;
    }
}
@media screen and (max-width: 960px) {
    #app {
        width: 700px;
    }
}
@media screen and (max-width: 767px) {
    #app {
        width: 100%;
    }
    input {
        width: 100%;
        height: 40px;
    }
}</style>