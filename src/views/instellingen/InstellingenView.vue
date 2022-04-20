<template>
    <div class="settings">
        <h1>Instellingen</h1>
        <ul>
            <li>
                <span v-if="denied">Je hebt de notificaties geweigerd, zet ze eerst aan via het menu van de browser en probeer het dan opnieuw.</span>
                Ontvang een notificatie zodra er een nieuwe editie verschijnt:
                <Switch :value="enabled" @change="checkNotificationStatus"/>
            </li>
        </ul>
        <div class="contact">
            <h1>Contact</h1>
            <p>Wil jij ook iets schrijven voor de schoolkrant of heb je een vraag of opmerking? Mail dan naar: <a href="mailto:schoolkrantadc@gmail.com">schoolkrantadc@gmail.com</a></p>
        </div>
    </div>
</template>

<style scoped lang="scss">
    @import '@/variables.scss';

    div.settings {
        display: flex;
        flex-direction: column;
        align-items: center;
        height: calc(100vh - 120px);
        overflow-y: scroll;

        ul {
            list-style: none;
            flex-grow: 1;
            margin: 0;

            li {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;

                span {
                    color: $red-accent;
                    font-weight: bold;
                }
            }
        }

        div.contact {
            display: flex;
            flex-direction: column;
            align-items: center;
            // margin-top: 50px;

            h1 {
                margin-bottom: 0;
            }

            a {
                color: $orange-light;
            }
        }
    }
</style>

<script lang="ts">
    import { Options, Vue } from "vue-class-component";
    import Switch from "@/components/Switch.vue";
    import * as ServiceworkerHandler from "@/serviceworkerHandler";
    import { User } from "@/user";

    @Options({
        components: {
            Switch
        }
    })
    export default class SettingsView extends Vue {
        enabled: boolean = false;

        created() {
            this.enabled = User.current.notifications;
        }

        get denied(): boolean {
            return Notification.permission === 'denied';
        }

        checkNotificationStatus(switchElement: HTMLInputElement) {
            this.enabled = switchElement.checked;

            if (this.enabled && !User.current.notifications) {
                if (Notification.permission === "denied") {
                    this.enabled = false;
                    switchElement.checked = false;
                } else if (Notification.permission !== 'granted') Notification.requestPermission().then(permission => {
                    if (permission === 'granted') {
                        navigator.serviceWorker.getRegistration().then(registration => {
                            ServiceworkerHandler.subscribeAndStore(registration!);
                            User.current.notifications = true;
                        });
                    } else {
                        this.enabled = false;
                        switchElement.checked = false;
                    }
                });
                else navigator.serviceWorker.getRegistration().then(registration => {
                    ServiceworkerHandler.subscribeAndStore(registration!);
                    User.current.notifications = true;
                });
            } else if (!this.enabled && User.current.notifications) {
                navigator.serviceWorker.getRegistration().then(registration => {
                    registration?.pushManager.getSubscription().then(subscription => {
                        ServiceworkerHandler.unsubscribeAndRemove(subscription!);
                        User.current.notifications = false;
                    });
                });
            }
        }
    }
</script>