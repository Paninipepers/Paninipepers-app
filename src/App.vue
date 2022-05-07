<template>
  <Title/>
  <router-view/>
  <Nav v-if="showNav"/>
  <div v-if="newUpdate" id="update-info">Update installeren</div>
  <div v-if="firstVisit" id="first-visit">
    <Popup :title="'Welkom!'" @close="firstVisit = false">
      <p>Je hebt onze app gevonden, een hele prestatie. Wees trots op jezelf en voeg hem ook gelijk even toe aan je hoofdscherm.{{ osInstructions }} Ga naar <a href="https://paninipepers.web.app/instructies" target="_blank">paninipepers.web.app/instructies</a> voor uitleg over het installeren van de app.</p>
    </Popup>
  </div>
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

    @media (orientation: landscape) and (max-width: 600px) {
      display: none;
    }
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

  #first-visit {
    display: flex;
    flex-direction: column;
    align-items: center;

    p {
      width: 90%;

      a {

        cursor: pointer;
        color: #F59A00;
      }
    }
  }
}
</style>

<script lang="ts">
  import { Options, Vue } from 'vue-class-component';
  import Title from '@/components/Title.vue';
  import Nav from './components/Nav.vue';
  import * as ServiceworkerHandler from './serviceworkerHandler';
  import { User } from './user';
  import Popup from './components/Popup.vue';
  import { Firebase } from './firebase';

  @Options({
    components: {
      Title,
      Nav,
      Popup
    },
    watch: {
            $route: {
                handler(from, to) {
                  if (from === "uitgaves") Firebase.logout();     
                }
            }
        }
  })
  export default class App extends Vue {
    newUpdate: boolean = false;
    firstVisit: boolean = false;

    created() {
      User.onFirstVisit = () => {
        this.firstVisit = true;
      };

      User.current = new User();

      ServiceworkerHandler.onUpdate(() => {
          this.newUpdate = true;

          setTimeout(() => {
            this.newUpdate = false;
            window.location.reload();
          }, 3000);
      });
    }

    get osInstructions() {
      let userAgent = navigator.userAgent || navigator.vendor;
    
      if (/windows phone/i.test(userAgent)) {
          return '';
      } else if (/android/i.test(userAgent)) {
          return " Doe dat via de 3 puntjes bovenin je beeldscherm.";
      } else if (/iPad|iPhone|iPod/.test(userAgent)) {
          return " Doe dat door op het vierkantje met een pijl te klikken.";
      }
    }

    get showNav() {
      return this.$route.name !== 'uitgaven';
    }
  }
</script>
