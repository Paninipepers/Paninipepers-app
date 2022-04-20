<template>
    <Login v-if="!loggedIn && !loading" @login="onLogin"/>
    <main v-if="loggedIn && !loading" class="uitgaves">
        <h1>Uitgaves</h1>
        <p v-if="uitgavesError.length > 0" class="error">{{ uitgavesError }}</p>
        <div class="controls">
            <button @click="uploadPopup = true"><MaterialIcon>add</MaterialIcon> Nieuwe uitgave</button>
            <button @click="downloadUitgave" :disabled="selectedUid.length < 1"><MaterialIcon>download</MaterialIcon> Download uitgave</button>
            <button @click="deleteUitgave" :disabled="selectedUid.length < 1"><MaterialIcon>delete</MaterialIcon> Verwijder uitgave</button>
        </div>
        <ul>
            <li v-for="uitgave in uitgaves" :key="uitgave.uid" @click="select(uitgave.uid)" :class="{ selected: selectedUid === uitgave.uid }">{{ uitgave.name }}</li>
        </ul>
        <h1>Notificaties</h1>
        <button @click="notificationPopup = true"><MaterialIcon>notifications</MaterialIcon>Notificatie sturen</button>
        <Popup :title="'Uploaden'" @close="uploadPopup = false" v-if="uploadPopup">
            <p v-if="uploadError.length > 0" class="error">{{ uploadError }}</p>
            <input type="text" ref="name" placeholder="Naam van uitgave" required>
            <div class="date-input">
                <label for="date">Datum van uitgave</label>
                <input type="date" ref="date" :value="new Date().toISOString().slice(0, 10)" required>
            </div>
            <div class="file-input">
                <label for="file-input">Selecteer een pdf</label>
                <input type="file" id="file-input" ref="file" accept=".pdf" required @change="gekozenFilename = $refs.file.files?.length > 0 ? $refs.file.files[0].name : ''">
                <p>{{ gekozenFilename }}</p>
            </div>
            <button id="upload-btn" @click="upload">Uploaden</button>
        </Popup>
        <Popup :title="'Notificatie'" @close="notificationPopup = false" v-if="notificationPopup">
            <p v-if="notificationError.length > 0" class="error">{{ notificationError }}</p>
            <input type="text" ref="notificationText" placeholder="Tekst van de notificatie" required>
            <button @click="sendNotification"><MaterialIcon>send</MaterialIcon>Verstuur</button>
        </Popup>
    </main>
    <Spinner v-if="loading"/>
</template>

<style scoped lang="scss">
    @import '@/variables.scss';

    .uitgaves {
        display: flex;
        flex-direction: column;
        align-items: center;

        button {
            border: none;
            background-color: $orange-base;
            margin-left: 25px;
            text-align: center;
            cursor: pointer;
            border: none;
            border-radius: 10px;
            box-shadow: 0px 0px 8px -2px rgba(0,0,0,0.75);
            outline: none;
            color: white;
            font-size: 1em;
            padding: 5px 10px;
            font-weight: bold;

            span {
                vertical-align: bottom;
            }
        }

        button:active {
            background-color: $blue-light;
        }

        ul {
            list-style: none;
            width: 50%;
            text-align: center;

            li {
                margin-bottom: 10px;
                cursor: pointer;
            }

            li:not(:last-child) {
                border-bottom: 2px solid black;
            }

            li.selected {
                color: $orange-light;
                font-weight: bold;
            }
        }

        .controls {
            display: flex;
            flex-direction: row;
            align-items: center;

            button {
                background-color: $blue-base;
            }

            button[disabled] {
                background-color: #85a8d4;
                cursor: not-allowed;
            }

            button:active {
                background-color: $orange-light;
            }
        }

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

        div.file-input {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;

            input {
                display: none;
            }

            label {
                margin-right: 20px;
                background-color: $orange-base;
                padding: 5px 10px;
                box-shadow: 0px 0px 8px -2px rgba(0,0,0,0.75);
                border-radius: 20px;
                color: white;
                font-weight: bold;
                cursor: pointer;
            }

            label:active {
                background-color: $blue-light;
            }
        }

        div.date-input {
            display: flex;
            flex-direction: row;
            justify-content: center;
            width: 100%;

            label {
                margin-right: 15px;
            }

            input {
                width: 50%;
            }
        }

        #upload-btn {
            margin-top: 25px;
            font-size: 1em;
            width: 50%;
            border-radius: 20px;
            background-color: $blue-base;
        }

        #upload-btn:active {
            background-color: $orange-light;
        }

        p.error {
            color: $red-accent;
            font-weight: bold;
            max-width: 80%;
            margin-top: 0px;
        }
    }
</style>

<script lang="ts">
    import { Options, Vue } from "vue-class-component";
    import Login from "./Login.vue";
    import { Firebase } from "@/firebase";
    import { Krant } from "@/krant";
    import MaterialIcon from '@/components/MaterialIcon.vue';
    import Popup from '@/components/Popup.vue';
    import Spinner from '@/components/Spinner.vue';

    @Options({
        components: {
            Login,
            MaterialIcon,
            Popup,
            Spinner
        }
    })
    export default class UitgavesView extends Vue {
        loading = false;
        loggedIn = false;
        notificationPopup = false;
        uploadPopup = false;
        uitgaves: Krant[] = [];
        selectedUid: string = '';
        uploadError: string = '';
        uitgavesError: string = '';
        notificationError: string = '';
        name: string = '';
        gekozenFilename: string = '';

        declare $refs: {
            name: HTMLInputElement,
            date: HTMLInputElement,
            file: HTMLInputElement,
            notificationText: HTMLInputElement
        };

        async onLogin() {
            this.uitgaves = await Firebase.getUitgaves();
            this.loggedIn = true;
            this.loading = false;
        }

        select(uid: string) {
            this.selectedUid = this.selectedUid === uid ? '' : uid;
        }

        async upload() {
            if (this.$refs.name.value.length < 1 || !this.$refs.date.valueAsDate || this.$refs.file.files!.length < 1) {
                this.uploadError = 'Vul alle velden in';
                return;
            }

            const file = this.$refs.file.files![0];

            if (file.type !== 'application/pdf') {
                this.uploadError = 'Kies een pdf bestand';
                return;
            }

            this.loading = true;

            let result = await Firebase.uploadKrant(file, this.$refs.name.value, this.$refs.date.valueAsDate);
            
            this.uitgaves = await Firebase.getUitgaves();
            this.loading = false;

            if (result.length > 0) this.uploadError = result;
            else this.uploadPopup = false;
        }

        async downloadUitgave() {
            if (this.selectedUid.length < 1) return;

            this.loading = true;

            let current = this.uitgaves.find(krant => krant.uid === this.selectedUid);

            if (!current) return;

            await this.downloadUrl(current.url, `${current.name}.pdf`);

            this.loading = false;
        }

        private async downloadUrl(url: string, filename: string) {
            let blob = await fetch(url).then(response => response.blob());
            let urlObj = URL.createObjectURL(blob);

            let a = document.createElement('a');
            a.href = urlObj;
            a.download = filename;

            a.click();

            setTimeout(() => URL.revokeObjectURL(urlObj), 60 * 1000);
        }

        async deleteUitgave() {
            if (this.selectedUid.length < 1) return;

            this.loading = true;

            let current = this.uitgaves.find(krant => krant.uid === this.selectedUid);

            if (!current) return;

            let result = await Firebase.deleteKrant(current);

            this.uitgaves = await Firebase.getUitgaves();
            this.loading = false;

            if (result.length > 0) this.uitgavesError = result;
        }

        async sendNotification() {
            if (this.$refs.notificationText.value.length < 1) {
                this.notificationError = 'Vul een bericht in';
                return;
            }

            this.loading = true;

            let result = await Firebase.sendNotification(this.$refs.notificationText.value);

            this.loading = false;

            if (result.length > 0) this.notificationError = result;
            else this.notificationPopup = false;
        }
    }
</script>