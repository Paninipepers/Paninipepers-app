import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import KrantView from '@/views/krant/KrantView.vue';
import SearchView from '@/views/search/SearchView.vue';
import SettingsView from '@/views/settings/SettingsView.vue';
import InstructiesView from '@/views/instructies/InstructiesView.vue';

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
  },
  {
    path: '/instructies',
    name: 'instructies',
    component: InstructiesView
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
