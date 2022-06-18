<template>
    <div v-if="!loading">
        <h1>Inloggen</h1>
        <p v-if="loginError.length > 0">{{ loginError }}</p>
        <input type="email" ref="email" placeholder="Email" required>
        <input type="password" ref="password" placeholder="Wachtwoord" required>
        <button @click="login">Inloggen</button>
    </div>
    <Spinner v-else/>
</template>

<style scoped lang="scss">
    @import '@/variables.scss';

    div {
        display: flex;
        flex-direction: column;
        align-items: center;

        @media (prefers-color-scheme: dark) {
            color: white;
        }

        input, button {
            margin-bottom: 25px;
            text-align: center;
            width: 50%;
            max-width: 350px;
            height: 2em;
            border: none;
            border-radius: 10px;
            box-shadow: 0px 0px 8px -2px rgba(0,0,0,0.75);
            outline: none;
        }

        button {
            background-color: $blue-light;
            color: white;
            font-weight: bold;
            cursor: pointer;
        }

        button:active {
            background-color: $orange-base;
        }

        p {
            color: $red-accent;
            font-weight: bold;
            max-width: 80%;
            margin-top: 0px;
        }
    }
</style>

<script lang="ts">
    import { Options, Vue } from "vue-class-component";
    import MaterialIcon from "@/components/MaterialIcon.vue";
    import Spinner from "@/components/Spinner.vue";
    import { Firebase } from "@/firebase";

    @Options({
        components: {
            MaterialIcon,
            Spinner
        },
        emits: ["login"]
    })
    export default class Login extends Vue {
        loginError = "";
        loading = false;

        declare $refs: {
            email: HTMLInputElement;
            password: HTMLInputElement;
        };

        async login() {
            if (this.$refs.email.value.length <= 0 || this.$refs.password.value.length <= 0) {
                this.loginError = "Vul alle velden in.";
                return;
            }

            this.loading = true;

            let result = await Firebase.login(this.$refs.email.value, this.$refs.password.value);
            this.loading = false;

            if (result.length !== 0) {
                this.loginError = `Kon niet inloggen: ${result}`;
            } else this.$emit("login");
        }
    }
</script>