<script setup lang="ts">
    import { computed, ref } from 'vue';
    import ToolbarComponent from '@/components/ToolbarComponent.vue';
    import ExploreApplications from '@/components/ExploreApplications.vue';
    import ExploreOrganizations from '@/components/ExploreOrganizations.vue';

    const tab = ref();
    const tabClass = computed(() => {
        switch(tab.value)
        {
            case 1:
                return ExploreApplications;
            case 2:
                return ExploreOrganizations;
        }
        return ExploreApplications;
    });
</script>

<template>
    <ToolbarComponent
        v-model:tab="tab"
        tabs
        search
        />
    <component :is="tabClass"/>
</template>
