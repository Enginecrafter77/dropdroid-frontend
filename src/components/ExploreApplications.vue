<script setup lang="ts">
    import { useRouter } from 'vue-router';
    import ItemApplication from './ItemApplication.vue';
    import { computed, inject, onMounted, ref } from 'vue';
    import type { AxiosInstance } from 'axios';
    import { Application, PaginationResponse } from '@/types';

    const router = useRouter();
    const apiClient = inject<AxiosInstance|undefined>("api");

    const props = defineProps({
        search: {
            type: String
        }
    });

    const apps = ref<Application[]>();

    const filteredApps = computed<Application[]>(() => {
        if(apps.value === undefined)
            return [];
        let items = apps.value;
        if(props.search != undefined && props.search != "")
        {
            const query = props.search.toLocaleLowerCase();
            items = Array.from(items.filter((a) => a.name.toLocaleLowerCase().includes(query) || a.namespace.toLocaleLowerCase().includes(query)));
        }
        return items;
    });

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
                v-for="app of filteredApps"
                :key="app.id"
                >
                <ItemApplication
                    :application="app"
                    @click="redirectToApp(app.id)"
                    />
            </v-col>
        </v-row>
    </v-container>
</template>
