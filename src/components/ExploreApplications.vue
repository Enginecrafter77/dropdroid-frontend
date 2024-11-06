<script setup lang="ts">
    import { useRouter } from 'vue-router';
    import ItemApplication from './ItemApplication.vue';

    const router = useRouter();
    defineProps({
        apps: {
            type: Array<{id: number, name: string, organizationName: string, icon: string}>,
            required: true
        }
    });

    function redirectToApp(id: number)
    {
        router.push(`/applications/${id}`);
    }
</script>

<template>
    <v-row class="app-grid">
        <v-col
            v-for="app in apps"
            :key="app.id"
            >
            <ItemApplication
                :app-id="app.id"
                :name="app.name"
                :organization-name="app.organizationName"
                :icon="app.icon"
                @click="redirectToApp(app.id)"
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
