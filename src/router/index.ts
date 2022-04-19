import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import KrantView from '../views/krant/KrantView.vue';
import SearchView from '../views/search/SearchView.vue';
import SettingsView from '../views/settings/SettingsView.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'krant',
    component: KrantView
  },
  {
    path: '/search',
    name: 'search',
    component: SearchView
  },
  {
    path: '/settings',
    name: 'settings',
    component: SettingsView
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
