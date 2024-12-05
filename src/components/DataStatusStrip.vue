<script setup lang="ts">
    import { DataStatus } from '@/types/datastatus';
    import type { PropType } from 'vue';

    const props = defineProps({
        status: {
            type: Number as PropType<DataStatus>
        }
    });
</script>

<template>
    <span>
        <span v-if="props.status === DataStatus.SAVING">Saving changes...</span>
        <span class="text-success" v-if="props.status === DataStatus.SAVED"><v-icon>mdi-check</v-icon> Changes saved</span>
        <span class="text-error" v-if="props.status === DataStatus.ERROR"><v-icon>mdi-alert-circle</v-icon> Error saving changes</span>
    </span>
</template>
