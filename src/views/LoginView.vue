<script setup lang="ts">
    import { reactive, ref } from 'vue';

    const tab = ref();
</script>
<template>
    <div class="login d-flex flex-column justify-center align-center ga-3">
        <div class="d-flex flex-row flex-1-0 justify-center align-center ga-10 pt-16 pb-8">
            <v-img aspect-ratio="1/1" :inline="true" class="page-icon" rounded="circle" src="/public/logo.png"/>
            <span class="page-title">DropDroid</span>
        </div>

        <v-text-field class="w-33"color="primary" label="Username"></v-text-field>
        <v-text-field class="w-33" color="primary" type="password" label="Password"></v-text-field>
        <v-btn to="/" class="w-25"rounded="lg" elevation="8" color="primary">
            Log in
        </v-btn>
        <v-btn to="/register" variant="outlined" class="w-10 p-5"rounded="lg" color="primary">
            Register
        </v-btn>
    </div>
</template>

<style>
    .page-title {
        font-size: 1.5rem;
        font-weight: 500;
    }
    .page-icon {
        width: 4rem;
        height: 4rem;
    }
</style>

