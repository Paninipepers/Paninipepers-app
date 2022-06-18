<template>
    <div class="background"></div>
    <div class="popup">
        <span class="material-icons close" @click="close">close</span>
        <h2>{{ title }}</h2>
        <slot></slot>
    </div>
</template>

<style scoped lang="scss">
    div.background {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 1;
    }

    div.popup {
        position: absolute;
        top: 50vh;
        left: 50vw;
        top: 50vh;
        left: 50vw;
        width: 90vw;
        max-width: 500px;
        height: 80vh;
        max-height: 350px;
        transform: translate(-50%, -50%);
        box-shadow: 0px 0px 23px -2px rgba(0,0,0,0.75);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        text-align: center;
        font-family: 'Nunito', sans-serif;
        border-radius: 50px;
        z-index: 2;
        background-color: white;

        @media (prefers-color-scheme: dark) {
            color: white;
            background-color: #0c0e11;
        }
    }

    span.close {
        position: absolute;
        top: 10px;
        left: calc(100% - 60px);
        cursor: pointer;
        color: red;
        font-size: 2em;
    }
</style>

<script lang="ts">
    import { Options, Vue } from "vue-class-component";

    @Options({
        props: {
            title: String
        },
        emits: ["close"]
    })
    export default class Popup extends Vue {
        title!: string;

        close() {
            this.$emit("close");
        }
    }
</script>