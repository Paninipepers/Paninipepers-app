<template>
    <canvas ref="target"></canvas>
</template>

<style scoped lang="scss">
    canvas {
        width: 90%;
        max-width: 1200px;
        box-shadow: 0px 0px 10px -2px rgba(0,0,0,0.75);
        margin-top: 10px;
        margin-bottom: 10px;
        border-radius: 10px;
    }
</style>

<script lang="ts">
    import { Options, Vue } from "vue-class-component";
    import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.js";

    @Options({
        emits: ["rendered"],
        props: {
            pdf: Object,
            page: Number
        }
    })
    export default class PdfPage extends Vue {
        pdf!: pdfjsLib.PDFDocumentProxy;
        page!: number;

        declare $refs: {
            target: HTMLCanvasElement
        };

        async mounted() {
            let page = await this.pdf.getPage(this.page);
            let viewport = page.getViewport({ scale: 1 });

            this.$refs.target.width = (innerWidth > innerHeight ? innerWidth : innerHeight) * 0.95;
            let scale = this.$refs.target.width / viewport.width;
            scale = scale < 1 ? 1 : scale;
            let scaledViewport = page.getViewport({ scale });

            this.$refs.target.height = scaledViewport.height;

            await page.render({
                canvasContext: this.$refs.target.getContext("2d")!,
                viewport: scaledViewport
            }).promise;

            this.$emit("rendered");
        }
    }
</script>