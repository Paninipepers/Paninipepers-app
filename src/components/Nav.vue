<template>
    <nav>
        <router-link to="/search"><MaterialIcon>search</MaterialIcon></router-link>
        <router-link to="/"><MaterialIcon>newspaper</MaterialIcon></router-link>
        <router-link to="/settings"><MaterialIcon>settings</MaterialIcon></router-link>
    </nav>
</template>

<style scoped lang="scss">
    @import '../variables.scss';

    nav {
        position: absolute;
        top: calc(100vh - 60px);
        width: 100vw;
        height: 60px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-evenly;
        box-shadow: 0px 0px 10px -2px rgba(0,0,0,0.75);
        background-color: white;

        .material-icons {
           cursor: pointer;
           font-size: 2em;
           color: black;
        }

        .router-link-exact-active .material-icons {
            color: white;
            background-color: $orange-base;
            padding: 6px 8px;
            border-radius: 20px;
        }
    }
</style>

<script lang="ts">
    import { Options, Vue } from 'vue-class-component';
    import MaterialIcon from './MaterialIcon.vue';

    type Tab = 'search' | 'newspaper' | 'settings';

    @Options({
        components: {
            MaterialIcon,
        }
    })
    export default class Nav extends Vue {
        select(tab: Tab) {

        }
    }
</script>