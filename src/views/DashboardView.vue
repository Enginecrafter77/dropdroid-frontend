<script setup lang="ts">
    import { ref } from 'vue';
    import ToolbarComponent from '@/components/ToolbarComponent.vue';

    const tab = ref();
</script>

<template>
    <ToolbarComponent
        v-model:tab="tab"
        tabs
        search
        />
    <span>{{ tab }}</span>
</template>
