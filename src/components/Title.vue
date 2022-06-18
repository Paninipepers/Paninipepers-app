<template>
    <header>
        <img src="../assets/logo.png" class="logo"/>
        <h2 class="title">Paninipepers</h2>
    </header>
</template>

<style scoped lang="scss">
    header {
        height: 50px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;

        @media (prefers-color-scheme: dark) {
            color: white;
        }

        .logo {
            max-height: 80%;
            margin-right: 20px;
        }
    }
</style>