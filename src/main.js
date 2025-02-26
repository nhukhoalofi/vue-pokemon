import './assets/main.css';
import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import HomeViews from './views/homeviews.vue';
import PokemonDetails from './components/pokemondetails.vue'; // Sửa đường dẫn

const routes = [
    {
        path: '/',
        component: HomeViews
    },
    {
        path: '/:name',
        component: PokemonDetails
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

createApp(App)
    .use(router)
    .mount('#app');
