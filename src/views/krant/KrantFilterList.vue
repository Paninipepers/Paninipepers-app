<template>
    <input type="text" placeholder="Zoek op naam" class="zoekterm" v-model="zoekterm">
    <ul>
        <li v-for="uitgave in filteredUitgaves" :key="uitgave.uid" @click="select(uitgave.uid)">{{ uitgave.name }}</li>
        <li v-if="uitgaves.length === 1">Er zijn nog geen eerdere uitgaven.</li>
        <li v-else-if="zoekterm.length > 0">Geen krant gevonden met deze naam.</li>
    </ul>
</template>

<style scoped lang="scss">
    @import '@/variables.scss';

    input {
        margin-bottom: 25px;
        text-align: center;
        width: 80%;
        height: 2em;
        border: none;
        border-radius: 10px;
        box-shadow: 0px 0px 8px -2px rgba(0,0,0,0.75);
        outline: none;
    }

    ul {
        list-style: none;
        margin: 0;

        li {
            cursor: pointer;
            margin-bottom: 10px;
        }

        li:active {
            color: $orange-light;
        }

        li:not(:last-child) {
            border-bottom: 3px solid $blue-light;
        }
    }
</style>

<script lang="ts">
    import { Options, Vue } from "vue-class-component";
    import { Krant } from "@/krant";

    @Options({
        props: {
            uitgaves: Array,
            current: Krant
        },
        emits: ["choose"]
    })
    export default class KrantFilterList extends Vue {
        uitgaves!: Krant[];
        current!: Krant;
        zoekterm: string = "";

        select(uid: string) {
            this.$emit("choose", uid);
        }

        get filteredUitgaves() {
            return this.zoekterm.length < 1 ? this.uitgaves.filter(uitgave => uitgave.uid !== this.current.uid) : this.uitgaves.filter(uitgave => uitgave.name.toLowerCase().includes(this.zoekterm.toLowerCase()) && uitgave.uid !== this.current.uid);
        }
    }
</script>