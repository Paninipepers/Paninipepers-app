import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import KrantView from '@/views/krant/KrantView.vue';
import ArchiefView from '@/views/archief/ArchiefView.vue';
import InstellingenView from '@/views/instellingen/InstellingenView.vue';
import InstructiesView from '@/views/instructies/InstructiesView.vue';
import UitgavesView from '@/views/uitgaves/UitgavesView.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'krant',
    component: KrantView
  },
  {
    path: '/archief',
    name: 'archief',
    component: ArchiefView
  },
  {
    path: '/instellingen',
    name: 'instellingen',
    component: InstellingenView
  },
  {
    path: '/instructies',
    name: 'instructies',
    component: InstructiesView
  },
  {
    path: '/uitgaves',
    name: 'uitgaves',
    component: UitgavesView
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
