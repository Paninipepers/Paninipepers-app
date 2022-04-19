<template>
    <label class="switch">
        <input type="checkbox" @change="onChange" ref="input">
        <span class="slider"></span>
    </label>
</template>

<style scoped lang="scss">
    .switch {
        position: relative;
        width: 60px;
        height: 34px;
        margin-top: 10px;
    }

    .switch input {
        opacity: 0;
        width: 0;
        height: 0;
    }

    .switch .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc;
        transition: .4s;
        border-radius: 34px;
    }

    .switch .slider:before {
        position: absolute;
        content: "";
        height: 26px;
        width: 26px;
        left: 4px;
        bottom: 4px;
        background-color: white;
        transition: .4s;
        border-radius: 50%;
    }

    input:checked + .slider {
        background-color: #F59A00;
    }

    input:checked + .slider:before {
        transform: translateX(26px);
    }
</style>

<script lang="ts">
    import { Options, Vue } from "vue-class-component";

    @Options({
        props: {
            value: Boolean
        },
        emits: ["change"]
    })
    export default class Switch extends Vue {
        value!: boolean;

        declare $refs: {
            input: HTMLInputElement
        };

        mounted() {
            this.$refs.input.checked = this.value;
        }

        onChange() {            
            this.$emit("change", this.$refs.input);
        }
    }
</script>