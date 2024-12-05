<script setup lang="ts">
    import { useRouter } from 'vue-router';
    import ItemApplication from './ItemApplication.vue';
    import { inject, onMounted, ref } from 'vue';
    import type { AxiosInstance } from 'axios';
    import { Application, PaginationResponse } from '@/types';

    const router = useRouter();
    const apiClient = inject<AxiosInstance|undefined>("api");
    const apps = ref<Application[]>();

    function redirectToApp(id: number)
    {
        router.push(`/applications/${id}`);
    }

    async function loadApps()
    {
        if(apiClient === undefined)
            return;
        const response = await apiClient.get<PaginationResponse<Application>>("/applications?count=100");
        apps.value = response.data.data;
    }

    onMounted(() => {
        loadApps();
    });
</script>

<template>
    <v-container fluid>
        <v-row>
            <v-col
                cols="12"
                sm="6"
                md="4"
                lg="3"
                v-for="app in apps"
                :key="app.id"
                >
                <ItemApplication
                    :app-id="app.id"
                    :name="app.name"
                    :organization-name="app.organization?.name"
                    :icon="app.icon_url"
                    @click="redirectToApp(app.id)"
                    />
            </v-col>
        </v-row>
    </v-container>
</template>
