<template>
  <Title/>
  <router-view/>
  <Nav/>
  <div v-if="newUpdate" id="update-info">Update installeren</div>
</template>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;700&display=swap');

body {
  margin: 0;
  overflow: hidden;
}

#app {
  display: flex;
  flex-direction: column;
  height: 100%;
  font-family: 'Nunito', sans-serif;

  header {
    flex: 0 1 50px;
  }

  main {
    flex: 1 1 auto;
  }

  nav {
    flex: 0 1 60px;
  }

  #update-info {
    position: fixed;
    top: calc(100vh - 110px);
    left: 50vw;
    transform: translateX(-50%);
    width: 12em;
    height: 2em;
    background-color: rgb(68, 248, 233);
    box-shadow: 0px 0px 23px -2px rgba(0, 0, 0, 0.87);
    border-radius: 20px;
    z-index: 2;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    font-family: 'Nunito', sans-serif;
    transition: opacity 1s ease-in-out;
    pointer-events: none;
  }
}
</style>

<script lang="ts">
  import { Options, Vue } from 'vue-class-component';
  import Title from '@/components/Title.vue';
  import Nav from './components/Nav.vue';
  import * as ServiceworkerHandler from './serviceworkerHandler';
  import { User } from './user';

  @Options({
    components: {
      Title,
      Nav
    }
  })
  export default class App extends Vue {
    newUpdate: boolean = false;

    created() {
      User.current = new User();

      ServiceworkerHandler.onUpdate(() => {
          this.newUpdate = true;

          setTimeout(() => {
            this.newUpdate = false;
            window.location.reload();
          }, 3000);
      });
    }
  }
</script>
