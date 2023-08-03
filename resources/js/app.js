import './bootstrap';
import '../sass/app.scss';
import { createApp } from 'vue';

import router from './router';
import AppComponent from './AppComponent.vue';


const app = createApp(AppComponent);
app.use(router);
app.mount('#app');