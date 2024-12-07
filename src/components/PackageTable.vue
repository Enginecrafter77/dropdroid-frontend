<script setup lang="ts">
</script>

<template>
    <v-table>
        <thead>
            <tr>
                <th class="text-left">Number</th>
                <th>Label</th>
                <th>Flavor</th>
                <th>Variant</th>
                <th>Version</th>
                <th class="text-right">Actions</th>
            </tr>
        </thead>
        <tbody>
            <slot></slot>
        </tbody>
    </v-table>
</template>
