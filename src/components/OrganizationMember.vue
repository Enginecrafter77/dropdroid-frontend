<script setup lang="ts">
    import { OrganizationMembership, OrganizationRole } from '@/types';
    import { getRoleLabel } from '@/utils';
    import { createEnumSelectMapping } from '@/utils/selectors';
    import type { AxiosInstance } from 'axios';
    import { inject, ref } from 'vue';

    const ROLE_SELECTION = createEnumSelectMapping(OrganizationRole,getRoleLabel);

    const apiClient = inject<AxiosInstance>("api");
    const props = defineProps({
        membership: {
            type: OrganizationMembership,
            required: true
        },
        manageable: {
            type: Boolean,
            default: false
        }
    });
    const emit = defineEmits(["edit", "delete"]);

    const deleting = ref<boolean>(false);
    const editing = ref<boolean>(false);
    const saving = ref<boolean>(false);
    const editedRole = ref<OrganizationRole>(OrganizationRole.MEMBER);

    async function deleteMember(){
        deleting.value = true;
        try
        {
            await apiClient?.delete(`/memberships/${props.membership?.id}`);
            emit("delete");
        }
        finally
        {
            deleting.value = false;
        }
        
    }

    function startEditing(){
        editedRole.value = props.membership?.role;
        editing.value = true; 
    }

    function stopEditing() {
        editing.value = false;
    }

    async function saveEdits() {
        try
        {
            saving.value = true;
            await apiClient?.put(`/memberships/${props.membership.id}`, {role: editedRole.value});
            props.membership.role = editedRole.value;
            emit("edit");
            editing.value = false;
        }
        finally
        {
            saving.value = false;
        }
    }
</script>
<template>
    <v-card>
        <div class="d-flex flex-column flex-sm-row justify-start align-center ga-4 px-4 py-4">
            <v-img
                class="member-icon flex-0-0"
                rounded="lg"
                :src="membership?.user?.avatar_url"
                >
                <template #placeholder>
                    <v-img class="member-icon flex-0-0" rounded="lg" src="/logo.svg"/>
                </template>
            </v-img>
            <div class="d-flex flex-column justify-center align-center align-sm-start flex-1-0">
                <div class="d-flex flex-column flex-sm-row justify-start align-center align-sm-end ga-2">
                    <span class="text-h5 font-weight-medium">{{ membership?.user?.display_name }}</span>
                    <span class="text-subtitle-1 text-secondary">{{ membership?.user?.username }}</span>
                </div>
                <span class="text-subtitle-1 text-secondary text-capitalize" v-if="!editing">{{ getRoleLabel(membership?.role) }}</span>
                <v-select
                    :items="ROLE_SELECTION"
                    variant="outlined"
                    v-model="editedRole"
                    v-if="editing"
                    />
            </div>
            <div class="d-flex flex-row justify-space-evenly justify-lg-end align-center" v-if="manageable">
                <v-btn
                    variant="text"
                    icon="mdi-check"
                    :loading="saving"
                    v-if="editing"
                    @click="saveEdits"
                    />
                <v-btn
                    variant="text"
                    icon="mdi-close"
                    v-if="editing"
                    @click="stopEditing"
                    />
                <v-btn
                    variant="text"
                    icon="mdi-pencil"
                    v-if="!editing"
                    @click="startEditing"
                    />
                <v-btn
                    color="error"
                    variant="text"
                    icon="mdi-delete"
                    :loading="deleting"
                    @click="deleteMember"
                    />
            </div>
        </div>
    </v-card>
</template>

<style>
    .member-icon {
        width: 8rem;
        height: 8rem;
    }
</style>
