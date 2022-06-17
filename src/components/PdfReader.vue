<template>
    <div class="reader">
        <PdfPage v-if="loaded" v-for="page in renderPages" :key="`${krant.uid}-${page}`" :pdf="pdf" :page="page"/>
    </div>
</template>

<style scoped lang="scss">
    div.reader {
        width: 100vw;
        max-height: calc(100vh - 170px);
        overflow: auto;
        display: flex;
        flex-direction: column;
        align-items: center;

        @media (orientation: landscape) and (max-width: 600px) {
            max-height: calc(100vh - 60px);
        }
    }
</style>

<script lang="ts">
    import { Options, Vue } from "vue-class-component";
    import PdfPage from "./PdfPage.vue";
    // @ts-ignore
    import PDFJSWorker from "pdfjs-dist/legacy/build/pdf.worker.entry"; 
    import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.js";
    import { Krant } from "@/krant";

    @Options({
        components: {
            PdfPage
        },
        props: {
            krant: Krant
        },
        emits: ["done"]
    })
    export default class PdfReader extends Vue {
        krant!: Krant;
        pdf!: pdfjsLib.PDFDocumentProxy;
        loaded = false;

        async beforeCreate() {
            pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJSWorker;

            this.pdf = await pdfjsLib.getDocument(this.krant.url).promise;
            this.loaded = true;
            this.$emit("done");
        }

        get renderPages() {
            return this.krant.pages.length > 0 ? this.krant.pages : Array.from({length: this.pdf.numPages}, (_, i) => i + 1);
        }
    }
</script>