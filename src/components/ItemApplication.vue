<script setup lang="ts">
    import { Application } from '@/types';

    defineProps({
        application: {
            type: Application
        }
    });
</script>

<template>
    <div class="d-flex flex-row justify-stretch align-center">
        <div class="d-flex flex-row justify-start align-center ga-4 pa-4 app-card">
            <v-img
                aspect-ratio="1/1"
                class="application-icon flex-0-0"
                rounded="lg"
                :src="application?.icon_url"
                cover >
                <template #placeholder>
                    <v-img
                        aspect-ratio="1/1"
                        class="application-icon flex-0-0"
                        rounded="lg"
                        src="/logo.png"/>
                </template>
            </v-img>
            <div class="d-flex flex-column justify-around align-start ga-2 flex-1-0">
                <span class="app-name">{{ application?.name }}</span>
                <span class="app-organization-name">{{ application?.organization?.name }}</span>
            </div>
        </div>
    </div>
</template>

<style>
    .application-icon {
        width: 6rem;
        height: 6rem;
    }
    .app-name {
        font-weight: 600;
        font-size: large;
    }
    .app-organization-name {
        font-weight: 400;
        font-size: small;
        color: #616161;
    }
    .app-card {
        min-width: 20rem;
        border-radius: 1rem;
        cursor: pointer;
        transition: background-color 0.2s;
    }
    .app-card:hover {
        background-color: #E0E0E0;
        transition: background-color 0.2s;
    }
</style>
