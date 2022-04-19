import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import * as ServiceworkerHandler from './serviceworkerHandler';

if (ServiceworkerHandler.shouldUseServiceWorker()) {
    ServiceworkerHandler.registerServiceWorker();
}

const app = createApp(App);

app.use(router);
app.mount('#app');
