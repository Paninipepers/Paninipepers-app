<template>
    <canvas ref="target"></canvas>
</template>

<style scoped lang="scss">
    canvas {
        width: 90vw;
        max-width: 1200px;
        box-shadow: 0px 0px 10px -2px rgba(0,0,0,0.75);
        margin-top: 10px;
        margin-bottom: 10px;
        border-radius: 2%;
    }
</style>

<script lang="ts">
    import { Options, Vue } from "vue-class-component";
    import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.js";

    @Options({
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

        mounted() {
            let observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.renderPage();
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                root: null,
                rootMargin: "0px",
                threshold: 0.01
            });

            observer.observe(this.$refs.target);
        }

        async renderPage() {
            let page = await this.pdf.getPage(this.page);
            let viewport = page.getViewport({ scale: 2 });

            this.$refs.target.width = viewport.width;
            this.$refs.target.height = viewport.height;

            await page.render({
                canvasContext: this.$refs.target.getContext("2d")!,
                viewport
            }).promise;
        }
    }
</script>