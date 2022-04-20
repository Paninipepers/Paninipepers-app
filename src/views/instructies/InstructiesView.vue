<template>
    <main>
        <h1>Instructies</h1>
        <div class="os-select">
            <button :class="{selected: !ios}" @click="force = 'android'">Android</button>
            <button :class="{selected: ios}" @click="force = 'ios'">iOS</button>
        </div>
        <div v-if="ios" class="instructie">
            <ol>
                <li>Ga naar de website van de schoolkrant <a href="https://paninipepers.web.app/" target="_blank" >https://paninipepers.web.app/</a>.<br><b>Let op: zorg dat je dit vanuit Safari opent!</b></li>
                <li>Open het menu van Safari door op het vierkantje met een pijl te klikken.<br><img src="images/ios vierkantje.jpg"></li>
                <li>Klik vervolgens op <a>Zet op beginscherm</a> om de app op je telefoon te zetten.<br><img src="images/ios menu.jpeg"></li>
            </ol>
        </div>
        <div v-else class="instructie">
            <ol>
                <li>Ga naar de website van de schoolkrant <a href="https://paninipepers.web.app/" target="_blank" >https://paninipepers.web.app/</a>.<br><b>Let op: zorg dat je dit vanuit Google Chrome opent!</b></li>
                <li>Open het menu van Chrome door op de drie puntjes rechtsboven te klikken.<br><img src="images/puntjes.jpg" class="puntjes"></li>
                <li>Klik vervolgens op <a>App installeren</a> om de app op je telefoon te zetten.<br><img src="images/puntjes-open.jpg" class="puntjes-open"></li>
            </ol>
        </div>
    </main>
</template>

<style scoped lang="scss">
    @import '@/variables.scss';

    main {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        div.os-select {
            display: flex;
            flex-direction: row;
            align-items: center;
            margin-bottom: 10px;
            
            button {
                margin-left: 20px;
                height: 2em;
                background-color: white;
                border: none;
                border-radius: 15px;
                box-shadow: 0px 0px 6px -2px rgba(0,0,0,0.75);
                padding-left: 10px;
                padding-right: 10px;
                text-align: center;
                cursor: pointer;
                outline: none;
                font-weight: bold;
            }

            button.selected {
                background-color: $blue-base;
                color: white;
            }
        }

        div.instructie {
            height: calc(100vh - 170px);
            overflow-y: scroll;

            a {
                color: $blue-light;
                font-weight: bold;
            }

            a[href] {
                color: $orange-base;
            }

            img {
                margin-top: 20px;
                margin-bottom: 20px;
                box-shadow: 0px 0px 23px -2px rgba(0,0,0,0.75);
            }

            img.puntjes {
                max-height: 5em;
            }

            img.puntjes-open {
                max-height: 30em;
            }
        }
    }
</style>

<script lang="ts">
    import { Options, Vue } from "vue-class-component";

    @Options({
        components: {
           
        }
    })
    export default class InstructiesView extends Vue {
        force: 'android' | 'ios' = 'android';

        get ios() {
            let userAgent = navigator.userAgent || navigator.vendor;
    
            if (/windows phone/i.test(userAgent)) {
                console.info('Windows Phone gedetecteerd, daarvoor zijn geen instructies dus default is android.');
                
                return false;
            } else if (/android/i.test(userAgent) || this.force === 'android') {
                return false;
            } else if (/iPad|iPhone|iPod/.test(userAgent) || this.force === 'ios') {
                return true;
            } else {
                console.info('Geen smartphone besturingssysteem gedetecteerd, dus default is android.');
                
                return false;
            }
        }
    }
</script>