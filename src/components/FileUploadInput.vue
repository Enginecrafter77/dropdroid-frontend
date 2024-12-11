<script setup lang="ts">
    import { DataStatus } from '@/types/datastatus';
    import { getFileMimeType } from '@/utils/mime';
    import type { AxiosInstance, AxiosProgressEvent } from 'axios';
    import { computed, inject, ref, type PropType } from 'vue';

    const apiClient = inject<AxiosInstance>("api");
    const props = defineProps({
        endpoint: {
            type: String
        },
        label: {
            type: String
        },
        variant: {
            type: String as PropType<"filled" | "underlined" | "outlined" | "plain" | "solo" | "solo-inverted" | "solo-filled">
        },
        mimeType: {
            type: String
        }
    });
    const emit = defineEmits(["upload"]);

    const file = ref<File>();
    const status = ref<DataStatus>(DataStatus.NOT_MODIFIED);
    const progress = ref<number>(0);

    const fileProgressColor = computed<string|undefined>(() => {
        switch(status.value)
        {
            case DataStatus.SAVED:
                return "success";
            case DataStatus.ERROR:
                return "error";
            default:
                return undefined;
        }
    });

    const progressInfo = computed<string|undefined>(() => {
        switch(status.value)
        {
            case DataStatus.SAVED:
                return "File uploaded!";
            case DataStatus.ERROR:
                return "File upload error!";
            case DataStatus.SAVING:
                return `Uploading... ${progress.value}%`;
            default:
                return undefined;
        }
    });

    async function uploadFile()
    {
        if(apiClient === undefined || props.endpoint === undefined)
            return;
        if(file.value === undefined)
        {
            status.value = DataStatus.NOT_MODIFIED;
            progress.value = 0;
            return;
        }
        try
        {
            status.value = DataStatus.SAVING;
            progress.value = 0;
            let mimeType = props.mimeType;
            if(mimeType === undefined)
                mimeType = await getFileMimeType(file.value);
            await apiClient.put(props.endpoint, file.value, {
                headers: {
                    "Content-Type": mimeType
                },
                onUploadProgress: (event: AxiosProgressEvent) => {
                    if(event.loaded === undefined || event.total === undefined)
                        return;
                    progress.value = (event.loaded / event.total) * 100;
                }
            });
            emit("upload");
            status.value = DataStatus.SAVED;
            progress.value = 100;
        }
        catch
        {
            status.value = DataStatus.ERROR;
            progress.value = 100;
        }
    }
</script>

<template>
    <div class="d-flex flex-column justify-normal align-stretch">
        <v-file-input
            :label="label"
            :variant="variant"
            v-model="file"
            hide-details
            @update:model-value="uploadFile"
            />
        <span class="text-center" v-if="progressInfo">{{ progressInfo }}</span>
        <v-progress-linear
            v-model="progress"
            :color="fileProgressColor"
            v-if="status != DataStatus.NOT_MODIFIED"
            />
    </div>
</template>
