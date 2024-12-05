<script setup lang="ts">
    defineProps({
        loading: {
            type: Boolean,
            default: false
        }
    });
</script>

<template>
    <div class="loading-overlay-container">
        <slot></slot>
        <div class="loading-overlay" v-if="loading">
            <div class="w-100 fill-height d-flex flex-col justify-center align-center">
                <v-progress-circular indeterminate/>
            </div>
        </div>
    </div>
</template>

<style>
    .loading-overlay-container {
        position: relative;
    }
    
    .loading-overlay {
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        background-color: rgba(255, 255, 255, 0.8);
    }
</style>
