<script setup lang="ts">
    import { Package } from '@/types';
import { downloadFile } from '@/utils';
    import { type AxiosInstance } from 'axios';
    import { inject, ref } from 'vue';

    const apiClient = inject<AxiosInstance>("api");
    const props = defineProps({
        package: {
            type: Package,
            required: true
        },
        manageable: {
            type: Boolean,
            default: false
        }
    });
    const emit = defineEmits(["delete"]);

    const deleting = ref<boolean>(false);

    async function deletePackage()
    {
        if(apiClient === undefined)
            return;
        try
        {
            deleting.value = true;
            await apiClient.delete(`/packages/${props.package.id}`);
            emit("delete");
        }
        finally
        {
            deleting.value = false;
        }
    }

    function downloadPackage()
    {
        const name = `${props.package.application?.id}-${props.package.version_code}-${props.package.version_name}.apk`;
        downloadFile(props.package.file_url, name);
    }
</script>

<template>
    <tr>
        <td class="text-left">{{ package.id }}</td>
        <td>{{ package.label ?? "-" }}</td>
        <td>{{ package.flavor }}</td>
        <td>{{ package.variant }}</td>
        <td>{{ package.version_name }} ({{ package.version_code }})</td>
        <td>
            <div class="d-flex flex-row justify-end align-center">
                <v-btn
                    variant="text"
                    icon="mdi-download"
                    @click="downloadPackage"
                    />
                <v-btn
                    variant="text"
                    icon="mdi-pencil"
                    :to="`/packages/${package.id}/edit`"
                    v-if="manageable"
                    />
                <v-btn
                    color="error"
                    variant="text"
                    icon="mdi-delete"
                    :loading="deleting"
                    @click="deletePackage"
                    v-if="manageable"
                    />
            </div>
        </td>
    </tr>
</template>
