<script setup lang="ts">
import { User } from '@/types';

    const props = defineProps({
        user:{
            type: User,
            required: true,
        }
    })
</script>
<template>
    <v-card>
        <div class="d-flex flex-row justify-start align-center px-4 py-2 ga-4">
            <v-avatar>
                <v-img
                    :src="`${user.avatar_url}`" 
                    />
            </v-avatar>
            <div class="d-flex flex-column justify-center align-start ga-2 flex-1-0">
                <div class="d-flex flex-row justify-start align-end ga-2">
                    <span class="text-h5">{{ user.display_name }}</span>
                    <span class="text-subtitle-1 text-secondary">({{ user.username }})</span>
                </div>
            </div>
        </div>
    </v-card>
</template>