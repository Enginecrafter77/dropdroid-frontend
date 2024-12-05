<script setup lang="ts">
    import ToolbarComponent from '@/components/ToolbarComponent.vue';
    import LoadingOverlay from '@/components/LoadingOverlay.vue';
    import { type AxiosInstance } from 'axios';
    import { inject, ref, watch } from 'vue';
    import { type Organization } from '@/types';
    import { DataStatus } from '@/types/datastatus';
    import { useRouter } from 'vue-router';
    import { getFileMimeType } from '@/utils/mime';
    import DataStatusStrip from '@/components/DataStatusStrip.vue';

    const apiClient = inject<AxiosInstance>("api");
    const router = useRouter();
    const props = defineProps({
        organizationId: {
            type: [Number, String],
            required: true
        }
    });
    const organization = ref<Organization>({
        id: 0,
        slug: "",
        name: "",
        description: undefined,
        icon_url: ""
    });

    const organizationIconFile = ref<File>();
    const status = ref<DataStatus>(DataStatus.NOT_MODIFIED);

    async function loadData() {
        if (apiClient === undefined)
            return;
        const response = await apiClient.get<Organization>(`/organizations/${props.organizationId}`);
        organization.value = response.data;
    }

    async function uploadIcon() {
        if (apiClient === undefined || organizationIconFile.value === undefined)
            return;
        const mime = await getFileMimeType(organizationIconFile.value);
        await apiClient.put(`/organizations/${props.organizationId}/icon`, organizationIconFile.value, {
            headers: {
                "Content-Type": mime
            }
        });
    }

    async function saveData() {
        if (apiClient === undefined)
            return;
        try
        {
            status.value = DataStatus.SAVING;
            await apiClient.put(`/organizations/${props.organizationId}`,organization.value);
            status.value = DataStatus.SAVED;
        }
        catch
        {
            status.value = DataStatus.ERROR;
        }
    }

    function doneEditing()
    {
        router.back();
    }

    watch(()=>props.organizationId, (value: number|string)=>{
        loadData();
    }, {immediate: true});
</script>

<template>
    <ToolbarComponent/>
    <v-container max-width="800" min-width="100" class="fill-height">
        <v-row>
            <v-col cols="12" align="center">
                <span class="organization-title">Edit Organization</span>
            </v-col>
            <v-col cols="12" md="6">
                <div class="d-flex flex-column justify-normal align-stretch ga-2">
                    <LoadingOverlay>
                        <v-img
                            class="w-100"
                            aspect-ratio="1/1"
                            :src="organization.icon_url"
                            />
                    </LoadingOverlay>
                    <v-file-input
                        label="Upload icon"
                        v-model="organizationIconFile"
                        type ='file'
                        @update:model-value="uploadIcon"
                        />
                </div>
            </v-col>
            <v-col cols="12" md="6">
                <div class="d-flex flex-column justify-normal align-stretch ga-2">
                    <v-text-field
                        color="primary"
                        label="Organization Handle"
                        v-model="organization.slug"
                        @change="saveData"
                        />
                    <v-text-field
                        color="primary"
                        label="Display Name"
                        v-model="organization.name"
                        @change="saveData"
                        />
                    <v-text-field
                        color="primary"
                        label="Description"
                        v-model="organization.description"
                        @change="saveData"
                        />
                </div>
            </v-col>
            <v-col cols="12">
                <div class="w-100 d-flex flex-column flex-sm-row justify-normal justify-sm-end align-center ga-2">
                    <DataStatusStrip :status="status" />
                    <v-btn
                        rounded="lg"
                        color="primary"
                        @click="doneEditing" 
                        >
                        Done
                    </v-btn>
                </div>
            </v-col>
        </v-row>
    </v-container>
</template>

<style>
    .organization-title {
        font-size: 1.5rem;
        font-weight: 500;
    }.organization-subtitle {
        font-size: 1.2rem;
        font-weight: 500;
    }
</style>