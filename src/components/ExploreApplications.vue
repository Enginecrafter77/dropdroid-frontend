<script setup lang="ts">
    import { useRouter } from 'vue-router';
    import ItemApplication from './ItemApplication.vue';
    import { inject, onMounted, shallowRef } from 'vue';
    import type { AxiosInstance } from 'axios';

    const router = useRouter();
    const apiClient = inject<AxiosInstance|undefined>("api");
    const apps = shallowRef<Array<{id: number, name: string, organizationName: string, icon: string}>>([]);

    function redirectToApp(id: number)
    {
        router.push(`/applications/${id}`);
    }

    async function loadApps()
    {
        const response = await apiClient?.get("/applications?count=100");
        apps.value = Array.from(response?.data.data.map((i: {id: number, name: string, organization: {name: string}, icon_url: string}) => {
            return {
                id: i.id,
                name: i.name,
                organizationName: i.organization.name,
                icon: i.icon_url
            }
        }));
    }

    onMounted(() => {
        loadApps();
    });
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
