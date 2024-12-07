<script setup lang="ts">
    import DataStatusStrip from '@/components/DataStatusStrip.vue';
import FileUploadInput from '@/components/FileUploadInput.vue';
    import ToolbarComponent from '@/components/ToolbarComponent.vue';
    import { Package } from '@/types';
    import { DataStatus } from '@/types/datastatus';
    import { type AxiosInstance } from 'axios';
    import { inject, ref, watch } from 'vue';
    import { useRouter } from 'vue-router';

    const router = useRouter();
    const apiClient = inject<AxiosInstance>("api");
    const props = defineProps({
        packageId: {
            type: [Number,String],
            required: true
        }
    });
    const pkg = ref<Package>(new Package());
    const status = ref<DataStatus>(DataStatus.NOT_MODIFIED);

    async function loadData()
    {
        if(apiClient === undefined)
            return;
        const response = await apiClient.get<Package>(`/packages/${props.packageId}`);
        pkg.value = response.data;
    }

    async function saveData()
    {
        if(apiClient === undefined)
            return;
        try
        {
            status.value = DataStatus.SAVING;
            await apiClient.put(`/packages/${props.packageId}`, pkg.value);
            status.value = DataStatus.SAVED;
        }
        catch
        {
            status.value = DataStatus.ERROR;
        }
    }

    function goBack()
    {
        router.back();
    }

    watch(() => props.packageId, loadData, {immediate: true});
</script>

<template>
    <ToolbarComponent/>
    <v-container>
        <v-row>
            <v-col cols="12" align="center">
                <span class="text-h3">Edit package</span>
            </v-col>
            <v-col cols="12">
                <FileUploadInput
                    label="APK File"
                    mime-type="application/vnd.android.package-archive"
                    :endpoint="`/packages/${packageId}/file`"
                    />
            </v-col>
            <v-col cols="12">
                <v-text-field
                    label="Label"
                    v-model="pkg.label"
                    @change="saveData"
                    />
            </v-col>
            <v-col cols="12" md="6">
                <v-text-field
                    label="Flavor"
                    v-model="pkg.flavor"
                    @change="saveData"
                    />
            </v-col>
            <v-col cols="12" md="6">
                <v-text-field
                    label="Variant"
                    v-model="pkg.variant"
                    @change="saveData"
                    />
            </v-col>
            <v-col cols="12" md="6">
                <v-text-field
                    label="Version name"
                    v-model="pkg.version_name"
                    @change="saveData"
                    />
            </v-col>
            <v-col cols="12" md="6">
                <v-text-field
                    label="Version code"
                    type="number"
                    v-model="pkg.version_code"
                    @change="saveData"
                    />
            </v-col>
            <v-col cols="12">
                <div class="d-flex flex-column flex-sm-row justify-normal justify-sm-end align-stretch align-sm-center ga-2">
                    <DataStatusStrip
                        :status="status"
                        />
                    <v-btn
                        color="primary"
                        @click="goBack"
                        >
                        Done
                    </v-btn>
                </div>
            </v-col>
        </v-row>
    </v-container>
</template>
