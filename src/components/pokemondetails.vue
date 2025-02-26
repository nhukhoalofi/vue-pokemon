<script setup>
import { ref, onMounted, defineProps, defineEmits } from 'vue';
const props = defineProps(['pokemon']);
const emit = defineEmits(['back']);
const evolutionChain = ref([]);
const description = ref('');
const height = ref('');
const weight = ref('');
const types = ref([]);
const abilities=ref([])
const stats = ref({
  HP: 0,
  ATK: 0,
  SPA:0,
  DEF: 0,
  SPD_1: 0, // Speed
  SPD_2: 0  // Special Defense
});

const getIDPokemon = (url) => {
  const parts = url.split('/');
  return parts[parts.length - 2];
};

const fetchPokemonData = async (id) => {
  try {
    // Fetch mô tả
    const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}/`);
    const speciesData = await speciesResponse.json();
    const entry = speciesData.flavor_text_entries.find(entry => entry.language.name === "en");
    description.value = entry ? entry.flavor_text.replace(/\f/g, " ") : "No description available.";

    // Lấy cây tiến hóa
    const evolutionChainResponse = await fetch(speciesData.evolution_chain.url);
    const evolutionChainData = await evolutionChainResponse.json();
    const evolutionNames = [];
    let current = evolutionChainData.chain;
    while (current) {
      const pokemonID = getIDPokemon(current.species.url);
      evolutionNames.push({ name: current.species.name, id: pokemonID });
      current = current.evolves_to[0];
    }
    evolutionChain.value = evolutionNames;
    const pokemonResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);
    const pokemonData = await pokemonResponse.json();

    height.value = pokemonData.height || "N/A";
    weight.value = pokemonData.weight || "N/A";
    types.value = pokemonData.types.length > 0 ? pokemonData.types.map(t => t.type.name) : ["N/A"];
    abilities.value = pokemonData.abilities.length > 0 ? pokemonData.abilities.map(a => a.ability.name) : ["N/A"];

    stats.value = pokemonData.stats.reduce((acc, stat) => {
      if (stat.stat.name === "hp") acc.HP = stat.base_stat;
      if (stat.stat.name === "attack") acc.ATK = stat.base_stat;
      if (stat.stat.name === "defense") acc.DEF = stat.base_stat;
      if (stat.stat.name === "special-attack") acc.SPA = stat.base_stat;
      if (stat.stat.name === "speed") acc.SPD_1 = stat.base_stat;
      if (stat.stat.name === "special-defense") acc.SPD_2 = stat.base_stat;
      return acc;
    }, {
      HP: "N/A",
      ATK: "N/A",
      DEF: "N/A",
      SPA: "N/A",
      SPD_1: "N/A",
      SPD_2: "N/A"
    });

  } catch (error) {
    description.value = "Failed to load description.";
    height.value = "N/A";
    weight.value = "N/A";
    types.value = ["N/A"];
    abilities.value = ["N/A"];
    stats.value = {
      HP: "N/A",
      ATK: "N/A",
      DEF: "N/A",
      SPA: "N/A",
      SPD_1: "N/A",
      SPD_2: "N/A"
    };
    evolutionChain.value = [];
  }
};

onMounted(() => {
  const id = getIDPokemon(props.pokemon.url);
  fetchPokemonData(id);
});
</script>

<template>
  <div class="full-screen-container">
    <button class="back-button" @click="emit('back')"> < Back</button>
    <div v-if="pokemon" class="pokemon-details">
        <div class="pokemon_image">
      <img 
        :src="`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${getIDPokemon(props.pokemon.url)}.png`" 
        alt="Pokemon Image"
        class="pokemon-image" />
    </div>
    <div class="pokemon-types">
        <span v-for="type in types" :key="type" :class="`type ${type}`">
        {{ type }}
      </span>
    </div>
    <div class="pokemon_name">
        <div class="pokemon_name">
         {{ props.pokemon.name.charAt(0).toUpperCase() + props.pokemon.name.slice(1) }}
    </div>
    </div>

    <div class="pokemon_content">
        {{ description }}
    </div>
    <div class="height_weight">
        <div class="pokemon_height">
        <p>Height</p>
        <div class="height">
        {{ height }} 
        </div> 
        </div>

        <div class="pokemon_weight">
        <p>Weight</p>
        <div class="weight">   
        {{ weight }} 
        </div> 
        </div>
    </div>
    <div class="pokemon_abilities">
        <p>Abilities:</p>
        <div class="abilities-container">
            <div v-for="ability in abilities" :key="ability" class="ability-box">
            {{ ability }}
        </div>
        </div>
    </div>
      <div class="pokemon_stats">
        <div class="HP">
            <div class="icon_HP">
                HP
            </div>
            {{ stats.HP }}
        </div>
        <div class="ATK">
            <div class="icon_ATK">
                ATK
            </div>
            {{ stats.ATK }}
        </div>
        <div class="DEF">
            <div class="icon_DEF">
                DEF
            </div>
            {{ stats.DEF }}
        </div>
        <div class="SPA">
            <div class="icon_SPA">
                SPA
            </div>
            {{ stats.SPA }}
        </div>
        <div class="SPD_1">
            <div class="icon_SPD_1">
                SPD
            </div>
            {{ stats.SPD_1 }}
        </div>
        <div class="SPD_2">
            <div class="icon_SPD_2">
                SPD
            </div>
            {{ stats.SPD_2 }}
        </div>
      </div>
      <div class="evolution">
  <h2>Evolution</h2>
  <div v-if="evolutionChain.length > 0" class="evolution-chain">
    <span v-for="(evo, index) in evolutionChain" :key="index" class="evolution-stage">
        {{ evo.name.charAt(0).toUpperCase() + evo.name.slice(1) }}
      <img :src="`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${evo.id}.png`" alt="Evolution Pokémon Image" class="evolution-image" />
      <span v-if="index < evolutionChain.length - 1"> > </span>
      
    </span>
  </div>
  <div v-else>
    No evolution chain available.
  </div>
</div>




    </div>
  </div>
</template>

<style>
.full-screen-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
    box-sizing: border-box;
    z-index: 1000;
    overflow: auto;
}

.back-button {
    position: absolute;
    top: 50px;
    left: 80px;
    padding: 5px 10px;
    border: none;
    border-radius: 50px;
    color: black;
    font-size: 16px;
    cursor: pointer;
    background-color: white;
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
}

.pokemon-details {
    text-align: center;
    max-width: 600px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap:20px;
}

.pokemon-details img {
    width: 200px;
    height: 200px;
    object-fit: contain;
}
.height_weight {
    display: flex;
    align-items: center;
    gap:80px;
}
.height,.weight {
   background-color: #f6f8fc;
   border-radius: 20px;
   width: 100px;
   height: 30px;
   display: flex;
    align-items: center;
    justify-content: center;
}
.pokemon_name {
    font-weight: bold;
    font-size: 30px;
}
.abilities-container {
    align-self: center;
    display: flex;
    gap: 80px;
    justify-content: center;
    align-items: center;
}
.ability-box {
    background-color: #f6f8fc;
    border-radius: 20px;
    border:none;
    width: 100px;
    height: 30px;
    font-size: 14px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
}
.pokemon_stats {
    display: flex;
    gap:70px;
}
.HP,.ATK,.DEF,.SPD_1,.SPD_2,.SPA {
    width: 40px;
    height: 62px;
    background-color: #f6f8fc;
    box-shadow:2px 2px 5px rgba(0, 0, 0, 0.2)    ;
    border-radius:30px ;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    
}
.icon_HP,.icon_ATK,.icon_SPD_1,.icon_DEF,.icon_SPD_2,.icon_SPA {
    background-color: white;
    border-radius:12px;
    width:30px;
    color:white;
}
.icon_HP {
    background-color: #df2140;
}
.icon_ATK{
    background-color: #ff994d;
}
.icon_SPD_1{
    background-color: #96da83;
}
.icon_DEF{
    background-color:#ff994d ;
}
.icon_SPD_2{
    background-color: #fb94a8;
}
.icon_SPA {
    background-color: #85ddff;
}
.evolution-chain {
    display: flex;

}
.evolution-stage {
    display: flex;
    align-items: center;
}
/* Loại màu sắc theo hệ */
</style>
