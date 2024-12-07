<script setup lang="ts">
    import PackageTable from '@/components/PackageTable.vue';
    import PackageTableItem from '@/components/PackageTableItem.vue';
    import ToolbarComponent from '@/components/ToolbarComponent.vue';
    import { Package, PaginationResponse } from '@/types';
    import { type AxiosInstance } from 'axios';
    import { inject, ref, watch } from 'vue';

    const apiClient = inject<AxiosInstance>("api");
    const props = defineProps({
        applicationId: {
            type: [Number,String],
            required: true
        }
    });

    const packages = ref<Package[]>([]);
    const creatingPackage = ref<boolean>(false);

    async function loadData()
    {
        if(apiClient === undefined)
            return;
        const response = await apiClient.get<PaginationResponse<Package>>(`/applications/by_id/${props.applicationId}/packages`);
        packages.value = response.data.data;
    }

    async function createPackage()
    {
        if(apiClient === undefined)
            return;
        try
        {
            creatingPackage.value = true;
            const response = await apiClient.post<Package>(`/applications/by_id/${props.applicationId}/packages`, new Package());
            packages.value = [...packages.value, response.data];
        }
        finally
        {
            creatingPackage.value = false;
        }
    }

    function removePackage(pkg: Package)
    {
        packages.value = Array.from(packages.value.filter((p) => p.id != pkg.id));
    }

    watch(() => props.applicationId, loadData, {immediate: true});
</script>

<template>
    <ToolbarComponent/>
    <v-container>
        <v-row>
            <v-col cols="12">
                <div class="d-flex flex-column justify-normal align-center ga-2">
                    <span class="text-h3">Packages</span>
                    <span class="text-subtitle-1 text-secondary">com.example.myapp</span>
                </div>
            </v-col>
            <v-col cols="12">
                <PackageTable>
                    <PackageTableItem
                        v-for="pkg of packages"
                        :key="pkg.id"
                        :package="pkg"
                        @delete="removePackage(pkg)"
                        />
                </PackageTable>
            </v-col>
        </v-row>
    </v-container>
    <v-fab
        app
        location="bottom end"
        color="primary"
        icon="mdi-plus"
        :loading="creatingPackage"
        @click="createPackage"
        />
</template>
