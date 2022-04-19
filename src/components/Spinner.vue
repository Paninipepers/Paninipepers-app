<template>
    <div id="spinner">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
</template>

<style scoped lang="scss">
    #spinner {
        position: fixed;
        display: inline-block;
        top: 25%;
        left: 50%;
        width: 60px;
        height: 60px;
        transform: translate(-50%, -50%);
        z-index: 2;

        div {
            box-sizing: border-box;
            display: block;
            position: absolute;
            width: 64px;
            height: 64px;
            margin: 8px;
            border: 8px solid #F59A00;
            border-radius: 50%;
            animation: spinner 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
            border-color: #F59A00 transparent transparent transparent;
        }

        div:nth-child(1) {
            animation-delay: -0.45s;
        }

        div:nth-child(2) {
            animation-delay: -0.3s;
        }

        div:nth-child(3) {
            animation-delay: -0.15s;
        }

        @keyframes spinner {
            0% {
                transform: rotate(0deg);
            }
            100% {
                transform: rotate(360deg);
            }
        }
    }
</style>