<script setup lang="ts">
    import ToolbarComponent from '@/components/ToolbarComponent.vue';
    import LoadingOverlay from '@/components/LoadingOverlay.vue';
    import { type AxiosInstance } from 'axios';
    import { inject, ref, watch } from 'vue';
    import { type Application } from '@/types';
    import { DataStatus } from '@/types/datastatus';
    import { useRouter } from 'vue-router';
    import { getFileMimeType } from '@/utils/mime';
    import DataStatusStrip from '@/components/DataStatusStrip.vue';
    import { shuffleUrl } from '@/utils';

    const apiClient = inject<AxiosInstance>("api");
    const router = useRouter();
    const props = defineProps({
        applicationId: {
            type: [Number, String],
            required: true
        }
    });
    const application = ref<Application>({
        id: 0,
        name: "",
        namespace: "",
        description: null,
        icon_url: "",
        organization: undefined
    });

    const applicationIconFile = ref<File>();
    const status = ref<DataStatus>(DataStatus.NOT_MODIFIED);

    async function loadData() {
        if (apiClient === undefined)
            return;
        const response = await apiClient.get<Application>(`/applications/by_id/${props.applicationId}`);
        application.value = response.data;
    }

    async function uploadIcon() {
        if (apiClient === undefined || applicationIconFile.value === undefined)
            return;
        const mime = await getFileMimeType(applicationIconFile.value);
        await apiClient.put(`/applications/by_id/${props.applicationId}/icon`, applicationIconFile.value, {
            headers: {
                "Content-Type": mime
            }
        });
        application.value.icon_url = shuffleUrl(application.value.icon_url);
    }

    async function saveData() {
        if (apiClient === undefined)
            return;
        try
        {
            status.value = DataStatus.SAVING;
            await apiClient.put(`/applications/by_id/${props.applicationId}`,application.value);
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

    watch(()=>props.applicationId, (value: number|string)=>{
        loadData();
    }, {immediate: true});
</script>

<template>
    <ToolbarComponent/>
    <v-container max-width="800" min-width="100" class="fill-height">
        <v-row>
            <v-col cols="12" align="center">
                <span class="application-title">Edit Application</span>
            </v-col>
            <v-col cols="12" md="6">
                <div class="d-flex flex-column justify-normal align-stretch ga-2">
                    <LoadingOverlay>
                        <v-img
                            class="w-100"
                            aspect-ratio="1/1"
                            :src="application.icon_url"
                            />
                    </LoadingOverlay>
                    <v-file-input
                        label="Upload icon"
                        v-model="applicationIconFile"
                        type ='file'
                        @update:model-value="uploadIcon"
                        />
                </div>
            </v-col>
            <v-col cols="12" md="6">
                <div class="d-flex flex-column justify-normal align-stretch ga-2">
                    <v-text-field disabled
                        color="primary"
                        label="Application ID"
                        v-model="application.namespace"
                        @change="saveData"
                        />
                    <v-text-field
                        color="primary"
                        label="Display Name"
                        v-model="application.name"
                        @change="saveData"
                        />
                    <v-text-field
                        color="primary"
                        label="Description"
                        v-model="application.description"
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
    .application-title {
        font-size: 1.5rem;
        font-weight: 500;
    }.application-subtitle {
        font-size: 1.2rem;
        font-weight: 500;
    }
</style>