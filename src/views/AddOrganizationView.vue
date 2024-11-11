<script setup lang="ts">
    import { reactive, ref } from 'vue';
    import ToolbarComponent from '@/components/ToolbarComponent.vue';

    const tab = ref();
</script>

<template>
    <div class="add-organization d-flex flex-column justify-center align-center">
        <ToolbarComponent/>
        <h2 class="mb-4">Add Organization</h2>
        <v-sheet class="opacity-20" height="12rem" width="12rem" rounded="rounded" color="primary">
        </v-sheet>
        <v-btn variant="tonal" class="w-33 mt-4 mb-8" rounded="lg" append-icon="mdi-upload" >
            Upload file
        </v-btn>
        <v-text-field class="w-33" color="primary" label="Organization Handle"></v-text-field>
        <v-text-field class="w-33" color="primary" label="Display name"></v-text-field>
        <v-text-field class="w-33" color="primary" label="Description"></v-text-field>
        <div class="d-flex flex-row justify-space-around align-end mx-5">
            <v-btn variant="outlined" to="/add-application" class="w-50 mx-8" rounded="lg" elevation="8" color="error">
                Cancel
            </v-btn>
            <v-btn to="/" class="w-100 mx-8" rounded="lg" elevation="8" color="primary">
                Save
            </v-btn>
        </div>
    </div>
</template>