<script setup lang="ts">
    import { inject, onMounted, ref, shallowRef } from 'vue';
    import ToolbarComponent from '@/components/ToolbarComponent.vue';
    import ExploreApplications from '@/components/ExploreApplications.vue';
    import { type AxiosInstance } from 'axios';

    const apiClient = inject<AxiosInstance|undefined>("api");
    const tab = ref();

    const apps = shallowRef<Array<{id: number, name: string, organizationName: string, icon: string}>>([]);

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
    <ToolbarComponent
        v-model:tab="tab"
        tabs
        search
        />
    <span>{{ tab }}</span>
    <ExploreApplications
        :apps="apps"
        />
</template>
