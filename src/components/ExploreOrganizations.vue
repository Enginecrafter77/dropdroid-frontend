<script setup lang="ts">
    import { inject, onMounted, ref } from 'vue';
    import ItemOrganization from './ItemOrganization.vue';
    import { type AxiosInstance } from 'axios';
    import { useRouter } from 'vue-router';
    import { Organization, PaginationResponse } from '@/types';

    const router = useRouter();
    const apiClient = inject<AxiosInstance|undefined>("api");
    const organizations = ref<Organization[]>();

    function redirectToOrganization(id: number)
    {
        router.push(`/organizations/${id}`);
    }

    async function loadOrganizations()
    {
        const response = await apiClient?.get<PaginationResponse<Organization>>("/organizations?count=100");
        organizations.value = response?.data.data;
    }

    onMounted(() => {
        loadOrganizations();
    });
</script>

<template>
    <v-container fluid>
        <v-row>
            <v-col
                cols="12"
                sm="6"
                md="4"
                lg="3"
                v-for="org of organizations"
                :key="org.id"
                >
                <ItemOrganization
                    :organization="org"
                    @click="redirectToOrganization(org.id)"
                    />
            </v-col>
        </v-row>
    </v-container>
</template>
