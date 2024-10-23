<script setup lang="ts">
    import ItemApplication from './ItemApplication.vue';

    defineProps({
        apps: {
            type: Array<{name: string, organizationName: string, icon: string}>,
            required: true
        }
    })
</script>

<template>
    <v-row class="app-grid">
        <v-col
            v-for="(app, index) in apps"
            :key="index"
            >
            <ItemApplication
                :name="app.name"
                :organization-name="app.organizationName"
                :icon="app.icon"
                />
        </v-col>
    </v-row>
</template>

<style>
    .app-grid {
        display: grid !important;
        grid-template-columns: repeat(4, 1fr);
    }
</style>
