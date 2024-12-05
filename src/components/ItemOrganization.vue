<script setup lang="ts">
    import { Organization } from '@/types';
    defineProps({
        organization: {
            type: Organization,
            required: true
        }
    });
</script>

<template>
    <div class="d-flex flex-row justify-center align-center">
        <div class="d-flex flex-row justify-start align-center ga-4 pa-4 organization-card">
            <v-img
                aspect-ratio="1/1"
                class="organization-icon flex-0-0"
                rounded="lg"
                :src="organization.icon_url"
                cover >
                <template #placeholder>
                    <v-img
                        aspect-ratio="1/1"
                        class="organization-icon flex-0-0"
                        rounded="lg"
                        src="/logo.png"/>
                </template>
            </v-img>
            <div class="d-flex flex-column justify-around align-start ga-2 flex-1-0">
                <span class="organization-name">{{ organization.name }}</span>
                <span class="organization-slug">{{ organization.slug }}</span>
            </div>
        </div>
    </div>
</template>

<style>
    .organization-icon {
        width: 6rem;
        height: 6rem;
    }
    .organization-name {
        font-weight: 600;
        font-size: large;
    }
    .organization-slug {
        font-weight: 400;
        font-size: small;
        color: #616161;
    }
    .organization-card {
        min-width: 20rem;
        border-radius: 1rem;
        cursor: pointer;
        transition: background-color 0.2s;
    }
    .organization-card:hover {
        background-color: #E0E0E0;
        transition: background-color 0.2s;
    }
</style>
