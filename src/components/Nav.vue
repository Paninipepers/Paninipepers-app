<template>
    <nav>
        <router-link to="/instructies"><MaterialIcon>help</MaterialIcon></router-link>
        <router-link to="/"><MaterialIcon>newspaper</MaterialIcon></router-link>
        <router-link to="/instellingen"><MaterialIcon>settings</MaterialIcon></router-link>
    </nav>
</template>

<style scoped lang="scss">
    @import '../variables.scss';

    nav {
        position: absolute;
        top: calc(100% - 60px);
        width: 100vw;
        height: 60px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-evenly;
        box-shadow: 0px 0px 10px -2px rgba(0,0,0,0.75);
        background-color: white;

        @media (prefers-color-scheme: dark) {
            background-color: #0c0e11;
        }

        .material-icons {
            cursor: pointer;
            font-size: 2em;
            color: black;

            @media (prefers-color-scheme: dark) {
                color: white;
            }
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

    @Options({
        components: {
            MaterialIcon,
        }
    })
    export default class Nav extends Vue {}
</script>