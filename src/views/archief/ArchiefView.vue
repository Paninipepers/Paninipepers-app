<template>
    <div>
        <MaterialIcon>build</MaterialIcon> Hier wordt nog aan gewerkt
    </div>
</template>

<style scoped lang="scss">
    div {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: calc(100vh - 120px);
    }
</style>

<script lang="ts">
    import { Options, Vue } from "vue-class-component";
    import MaterialIcon from "@/components/MaterialIcon.vue";

    @Options({
        components: {
            MaterialIcon,
        }
    })
    export default class ArchiefView extends Vue {

    }
</script>