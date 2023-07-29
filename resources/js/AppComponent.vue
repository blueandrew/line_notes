<template>
    <div class="container" id="app">
        <router-view/>
    </div>
</template>

<script>
    export default {
        mounted() {
            console.log("AppComponent.")
        }
    }
</script>