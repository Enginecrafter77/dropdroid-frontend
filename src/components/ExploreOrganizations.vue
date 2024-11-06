<script setup lang="ts">
    import { inject, onMounted, shallowRef } from 'vue';
    import ItemOrganization from './ItemOrganization.vue';
    import { type AxiosInstance } from 'axios';

    const apiClient = inject<AxiosInstance|undefined>("api");
    const organizations = shallowRef<Array<{id: number, slug: string, name: string, icon: string}>>([]);

    function redirectToOrganization(id: number)
    {
        console.log(`TODO redirect to org ${id}`);
    }

    async function loadOrganizations()
    {
        const response = await apiClient?.get("/organizations?count=100");
        organizations.value = Array.from(response?.data.data.map((i: {id: number, slug: string, name: string, icon_url: string}) => {
            return {
                id: i.id,
                slug: i.slug,
                name: i.name,
                icon: i.icon_url
            };
        }));
    }

    onMounted(() => {
        loadOrganizations();
    });
</script>

<template>
    <v-row>
        <v-col
            v-for="org of organizations"
            :key="org.id"
            >
            <ItemOrganization
                :organization-id="org.id"
                :slug="org.slug"
                :name="org.name"
                :icon="org.icon"
                @click="redirectToOrganization(org.id)"
                />
        </v-col>
    </v-row>
</template>
