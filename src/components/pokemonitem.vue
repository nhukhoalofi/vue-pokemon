<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();

const goToDetails = () => {
  router.push(`/${props.pokemon.name}`);
};
function getIDPokemon(url) {
    const parts = url.split('/');
    return parseInt(parts[parts.length - 2], 10);
}

const props = defineProps(['pokemon'])
const emit = defineEmits(['selectPokemon'])
const types = ref([]);

const handleClick = () => {
  console.log('Clicked:', props.pokemon);
  emit('selectPokemon', props.pokemon);
};

async function fetchPokemonDetails() {
    const id = getIDPokemon(props.pokemon.url);
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const data = await response.json();
    types.value = data.types.map(t => t.type.name);
}

onMounted(() => {
    fetchPokemonDetails();
});
</script>

<template>
  <div class="pokemon-item" @click="handleClick">
      <div class="pokemon-id">
        #{{ getIDPokemon(props.pokemon.url) }}
      </div>
      <div>
        <img 
          :src="`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${getIDPokemon(props.pokemon.url)}.png`" 
          alt="Pokemon Image"
          class="pokemon-image" 
        />
      </div>
      <div class="pokemon-name">
          {{ props.pokemon.name.charAt(0).toUpperCase() + props.pokemon.name.slice(1) }}
      </div>
      <div class="pokemon-types">
        <span v-for="type in types" :key="type" :class="`type ${type}`">
          {{ type }}
        </span>
      </div>
  </div>
</template>
