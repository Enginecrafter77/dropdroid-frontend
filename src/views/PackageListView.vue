<script setup lang="ts">
    const props = defineProps({
        applicationId: {
            type: [Number,String]
        }
    });
</script>

<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <div class="d-flex flex-column justify-normal align-center ga-2">
                    <span class="text-h3">Packages</span>
                    <span class="text-subtitle-1 text-secondary">com.example.myapp</span>
                </div>
            </v-col>
            <v-col cols="12">
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

                    </tbody>
                </v-table>
            </v-col>
        </v-row>
    </v-container>
</template>
