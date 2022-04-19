<template>
    <div>
        <h1>Instellingen</h1>
        <ul>
            <li>
            <span v-if="denied">Je hebt de notificaties geweigerd, zet ze eerst aan via het menu van de browser en probeer het dan opnieuw.</span>
            Ontvang een notificatie zodra er een nieuwe editie verschijnt:
            <Switch :value="enabled" @change="checkNotificationStatus"/>
            </li>
        </ul>
    </div>
</template>

<style scoped lang="scss">
    @import '@/variables.scss';

    div {
        display: flex;
        flex-direction: column;
        align-items: center;

        ul {
            list-style: none;
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