<script setup>
import { ref } from 'vue';
let pokemon = ref(null);
let isLoading = ref(true);
let pokemonData = sessionStorage.getItem("clickedPokemon");
if (pokemonData)
{
    pokemon.value = JSON.parse(pokemonData);
}
let dataPromise = ref(null);
let dataEvolution = ref({});
let currentDirect = ref({});
async function fetchPromise(URL) {
    try {
        const response = await fetch(URL);
        return await response.json();
    } catch (error) {
        console.error("Lỗi khi fetch dữ liệu:", error);
        return null;
    }
}
function getIDPokemon(url) {
    const parts = url.split('/'); 
    return parseInt(parts[parts.length - 2], 10);
}
function getShortName(name)
{
    let text;
    switch (name)
    {
        case "hp":
            text = "hp";
            break;
        case "attack":
            text = "atk";
            break;
        case "defense":
            text = "def";
            break;
        case "special-attack":
            text = "spa";
            break;
        case "special-defense":
            text = "spd";
            break;
        case "speed":
            text = "spd";
            break;
    }
    return text;
}
const linkDesc = `https://pokeapi.co/api/v2/pokemon-species/${pokemon.value.name}`;
async function fetchAPI ()
{
    if (pokemon.value) {
        dataPromise.value = await fetchPromise(pokemon.value.url);
        const descData = await fetchPromise(linkDesc);
        dataPromise.value.flavor_text = descData.flavor_text_entries[1].flavor_text;
        dataEvolution.value = await fetchPromise(descData.evolution_chain.url);
    }
}
fetchAPI();
let pokemonArray = ref([]);
let tmpDirect = {};
async function getEvolutionChain ()
{
    await fetchAPI();
    currentDirect.value = dataEvolution.value.chain;
    do {
        pokemonArray.value.push(currentDirect.value.species);
        tmpDirect = currentDirect.value;
        if (currentDirect.value.evolves_to.length != 0) {
            currentDirect.value = currentDirect.value.evolves_to[0];
        }
    }
    while (tmpDirect.evolves_to.length != 0);
}
async function getDataPokemon()
{
    await getEvolutionChain();
    setTimeout(()=>{
        isLoading.value = false;
    }, 1000)
}
getDataPokemon();
</script>
<template>
    <div v-if="isLoading" class="full-screen-div">
        <p>Getting data from PokeDex...</p>
    </div>
    <div v-else>
        <RouterLink to ="/" class="button-back">Back</RouterLink>
        <div class="pokemon-detail">
            <img class="item__image" :src="`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${getIDPokemon(pokemon.url)}.png`">
            <div class="types">
                <div class="type-item" v-for="item in pokemon.types" :key="item" :class="item">
                    {{ item }}
                </div>
            </div>
            <h3 class="item__name detail">{{pokemon.name}}</h3>
        </div>
        <div class="box-infor">

            <div class="description">
                <p>{{ dataPromise.flavor_text }}</p>
            </div>
            <div class="information">
                <div class="size">
                    <div class="height">
                        <p>Height</p>
                        <span>{{ dataPromise.height }}</span>
                    </div>
                    <div class="weight">
                        <p>Weight</p>
                        <span>{{ dataPromise.weight }}</span>
                    </div>
                </div>
                <div class="abilities">
                    <div class="abilities-title title">
                        <p>Abilities</p>
                    </div>
                    <div class="abilities-box">
                        <div class="ability-item" v-for="ability in dataPromise.abilities" :key="ability">
                            {{ ability.ability.name }}
                        </div>
                    </div>
                </div>
                <div class="stats">
                    <div class="stats-title title">
                        <p>Stats</p>
                    </div>
                    <div class="stats-box">
                        <div class="stat-item" v-for="stat in dataPromise.stats" :key="stat">
                            <div class="stat-name" :class="getShortName(stat.stat.name)">{{ getShortName(stat.stat.name) }}</div>
                            <span>{{ stat.base_stat }}</span>
                        </div>
                    </div>
                </div>
                <div class="evolution">
                    <div class="evolution-title title">
                        <p>Evolution</p>
                    </div>
                    <div class="evolution-box">
                        <div class="evolution-item" v-for="(evoItem, index) in pokemonArray" :key="evoItem">
                            <b v-show="index != 0">&gt;</b>
                            <span class="evoItem-name">{{ evoItem.name }}</span>
                            <img :src="`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${getIDPokemon(evoItem.url)}.png`" alt="">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style>
.full-screen-div
{
    height: 100vh;
    width: 100vw;
    /* text-align: center; */
    font-size: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
}
.button-back
{
    position: fixed;
    top: 5%;
    left: 5%;
    border-radius: 30px;
    padding: 5px 10px;
    box-shadow: #63636333 0 4px 8px;
    border-color: transparent;
    cursor: pointer;
}
.pokemon-detail
{
    height: auto;
    margin-inline: auto;
    width: 100px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.box-infor
{
    max-width: 500px;
}
.box-infor .description
{
    font-weight: 400;
    font-size: 18px;
}
.item__image
{
    width: 200px;
    height: 200px;
}
.item__name.detail
{
    font-size: 24px;
    text-transform: capitalize;
}
.evolution
{
    display: flex;
    flex-direction: column;
    /* align-items: center; */
}
.evolution-box
{
    display: flex;
    justify-content: center;
    gap: 20px;
}
.evolution-item
{
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.evoItem-name
{
    margin-left: 10px;
}
.box-infor
{
    margin-inline: auto;
    text-align: center;
}
.size, .abilities-box
{
    display: flex;
    justify-content: center;
    gap: 100px;
}
.size span, .ability-item
{
    display: block;
    width: 100px;
    margin: 5px;
    padding: 8px 4px;
    background-color: #f6f8fc;
    border-radius: 30px;
    text-transform: capitalize;
}
.size p{
    font-size: 20px;
    font-weight: 550;
}
.title
{
    font-weight: 550;
    font-size: 20px;
    text-transform: capitalize;
}
.stats
{
    display: flex;
    gap: 10px;
    align-items: center;
    flex-direction: column;
}
.stats-box
{
    display: flex;
    gap: 20px;
    justify-content: center;
}
.stat-item
{
    display: flex;
    flex-direction: column;
    border-radius: 30px;
    box-shadow: #63636333 0 2px 8px;
    background-color: #f6f8fc;
    padding: 5px;
    margin: 5px;
}
.stat-name
{
    border-radius: 50%;
    padding: 2px;
    height: 30px;
    width: 30px;
    display: flex;
    font-size: 12px;
    align-items: center;
    justify-content: center;
    text-transform: uppercase;
    color: white;
}
.evoItem-name
{
    text-transform: capitalize;
    font-size: 18px;
    font-weight: 500;
}
.hp
{
    background-color: #DF2140;
} 
.atk
{
    background-color: #FF994D;
} 
.def
{
    background-color: #EECD3D;
} 
.spa 
{
    background-color: #85DDFF;
}
.spd
{
    background-color: #96DA83;
}
.spd
{
    background-color: #FB94A8;
}
</style>