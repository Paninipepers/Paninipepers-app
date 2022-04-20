<template>
    <main>
        <ul class="current-list">
            <li v-if="uitgaves.length > 0" class="selected">{{ current.name }}</li>
            <li v-else>Geen krant gevonden</li>
            <li @click="zoekenPopup = true"><MaterialIcon>search</MaterialIcon>Zoeken naar meer edities</li>
        </ul>
        <PdfReader v-if="uitgaves.length > 0" :krant="current" :key="current.uid" @done="loading = false"/>
    </main>
    <Popup v-if="zoekenPopup" :title="'Kranten zoeken'" @close="zoekenPopup = false">
        <KrantFilterList :uitgaves="uitgaves" :current="current" @choose="currentFromUid"/>
    </Popup>
    <Spinner v-if="loading"/>
</template>

<style scoped lang="scss">
    @import '@/variables.scss';

    main {
        display: flex;
        flex-direction: column;
        align-items: center;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        align-items: center;


        ul.current-list {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            align-items: center;
            justify-content: center;
            margin-top: 0;

            

            li {
                display: flex;
                padding: 8px 10px;
                background-color: #ECECEC;
                color: black;
                font-weight: bold;
                letter-spacing: 0.1em;
                border-radius: 30px;
                cursor: pointer;
                margin-top: 10px;
            }

            li.selected {
                background-color: $blue-base;
                color: white;

                @media (max-width: 600px) {
                    display: none;
                }
            }

            li:not(:last-child) {
                margin-right: 10px;
            }
        }

        .reader {
            width: 100vw;
            height: calc(100vh - 180px);
            max-width: 1200px;
            overflow-y: scroll;

            .vue-pdf-main {
                width: 90%;
                max-width: 1200px;

                canvas {
                    box-shadow: 0px 0px 10px -2px rgba(0,0,0,0.75);
                    margin-top: 10px;
                    margin-bottom: 10px;
                    margin-left: 20px;
                    border-radius: 10px;
                }

                div div div {
                    display: none;
                }
            }
        }

        input.zoekterm {
            text-align: center;
            width: 80%;
            height: 2em;
            border: none;
            border-radius: 10px;
            box-shadow: 0px 0px 8px -2px rgba(0,0,0,0.75);
            outline: none;
        }
    }
</style>

<script lang="ts">
    import { Options, Vue } from 'vue-class-component';
    import { Krant } from '@/krant';
    import { Firebase } from '@/firebase';
    import Popup from '@/components/Popup.vue';
    import MaterialIcon from '@/components/MaterialIcon.vue';
    import KrantFilterList from './KrantFilterList.vue';
    import Spinner from '@/components/Spinner.vue';
    import PdfReader from '@/components/PdfReader.vue';

    @Options({
        components: {
            Popup,
            MaterialIcon,
            KrantFilterList,
            Spinner,
            PdfReader
        }
    })
    export default class KrantView extends Vue {
        uitgaves: Krant[] = [];
        current!: Krant;
        pages: number = 0;
        zoekenPopup = false;
        loading = true;

        created() {    
            Firebase.getUitgaves().then(uitgaves => {
                this.uitgaves = uitgaves;        

                if (this.uitgaves.length > 0) {
                    this.current = this.uitgaves[0];
                    // this.loading = false;
                }
            });
        }

        async currentFromUid(uid: string) {
            let current = this.uitgaves.find(uitgave => uitgave.uid === uid);

            if (!current) return;

            this.zoekenPopup = false;
            this.loading = true;
            this.current = current;
            // this.loading = false;
        }
    }
</script>