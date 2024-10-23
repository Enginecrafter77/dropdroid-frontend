<script setup lang="ts">
    import { reactive, ref } from 'vue';
    import ToolbarComponent from '@/components/ToolbarComponent.vue';
    import ExploreApplications from '@/components/ExploreApplications.vue';

    const tab = ref();

    const apps = reactive<Array<{name: string, organizationName: string, icon: string}>>([]);
    for(let index = 0; index < 7; ++index)
    {
        apps.push({
            name: "App1",
            organizationName: "Andraci1",
            icon: "/public/logo.png"
        });
    }

    function addApp()
    {
        apps.push({
            name: "App1",
            organizationName: "Andraci1",
            icon: "/public/logo.png"
        });
    }
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
    <v-btn @click="addApp">Add app</v-btn>
</template>
