<script setup lang="ts">
    import DataStatusStrip from '@/components/DataStatusStrip.vue';
    import ItemOrganization from '@/components/ItemOrganization.vue';
    import PasswordChangeDialog from '@/components/PasswordChangeDialog.vue';
    import ToolbarComponent from '@/components/ToolbarComponent.vue';
    import router from '@/router';
    import { type Organization, type OrganizationMembership, type PaginationResponse, type User } from '@/types';
    import { DataStatus } from '@/types/datastatus';
import { shuffleUrl } from '@/utils';
    import { getFileMimeType } from '@/utils/mime';
    import { type AxiosInstance } from 'axios';
    import { type Ref, inject, computed, shallowRef, watch, ref } from 'vue';

    const currentUser = inject<Ref<User|undefined>>("currentUser");
    const apiClient = inject<AxiosInstance>("api");
    const memberships = shallowRef<OrganizationMembership[]>([]);

    const editing = ref<boolean>(false);
    const editingPassword = ref<boolean>(false);
    const display_name = ref<string>();
    const user_handle = ref<string>();
    const icon_file = ref<File>();
    const status = ref<DataStatus>(DataStatus.NOT_MODIFIED);

    if(currentUser === undefined)
        throw new Error("currentUser not injected");

    function startEditing() {
        editing.value = true;
        status.value = DataStatus.NOT_MODIFIED;
        display_name.value = currentUser?.value?.display_name;
        user_handle.value = currentUser?.value?.username;
    }

    function stopEditing() {
        editing.value = false;
    }

    function editPassword() {
        editingPassword.value = true;
    }

    async function loadMemberships()
    {
        const response = await apiClient?.get<PaginationResponse<OrganizationMembership>>(`/users/${currentUser?.value?.id}/organizations?count=100`);
        if(response == null)
            return;
        memberships.value = response.data.data;
    }

    async function createOrganization() {
        const asyncResponce = await apiClient?.post<Organization>(`/organizations`,{
            slug:"organization_handle11",
            name:"Example Name",
            description:"description",
            icon_url:""
        });
        router.push(`/organizations/${asyncResponce?.data.id}/edit`);
    }

    async function saveData() {
        if (apiClient === undefined || currentUser?.value === undefined || user_handle.value === undefined || display_name.value === undefined)
            return;
        try
        {
            status.value = DataStatus.SAVING;
            await apiClient.put(`/users/${currentUser.value.id}`,{
                display_name: display_name.value,
                username: user_handle.value
            });
            currentUser.value.display_name = display_name.value;
            currentUser.value.username = user_handle.value;
            status.value = DataStatus.SAVED;
        }
        catch
        {
            status.value = DataStatus.ERROR;
        }
    }

    async function uploadIcon() {
        if (apiClient === undefined || icon_file.value === undefined || currentUser?.value === undefined)
            return;
        const mime = await getFileMimeType(icon_file.value);
        await apiClient.put(`/users/${currentUser.value.id}/avatar`, icon_file.value, {
            headers: {
                "Content-Type": mime
            }
        });
        currentUser.value.avatar_url = shuffleUrl(currentUser.value.avatar_url);
    }

    watch(currentUser, () => {
        loadMemberships();
    }, {immediate: true});
</script>

<template>
    <ToolbarComponent/>
    <div class="d-flex fill-height flex-row justify-start align-stretch">
        <div class="profile-column d-flex fill-height flex-column justify-start align-stretch pa-8">
            <div class="profile-user-avatar">
                <v-img
                    rounded="lg"
                    :src="currentUser?.avatar_url"
                    />
            </div>
            <v-scroll-y-transition hide-on-leave>
                <div class="d-flex flex-column justify-start align-center ga-2" v-if="!editing">
                    <div class="d-flex flex-row justify-center align-center">
                        <span class="profile-display-name">{{ currentUser?.display_name }}</span> 
                        <v-btn
                            icon="mdi-pencil-outline"
                            variant="text"
                            color="secondary"
                            @click="startEditing" />
                    </div>
                    <span class="profile-username text-secondary">{{ currentUser?.username }}</span>
                </div>
                <div class="d-flex flex-column justify-start align-stretch ga-2" v-if="editing">
                    <v-file-input
                        min-width="10rem"
                        label="Upload icon"
                        v-model="icon_file"
                        @update:model-value="uploadIcon"
                        />
                    <v-text-field
                        label="Display Name"
                        variant="underlined"
                        v-model="display_name"
                        @change="saveData"
                        />
                    <v-text-field
                        min-width="10rem"
                        label="Username"
                        variant="underlined"
                        v-model="user_handle"
                        @change="saveData"
                        />
                    <DataStatusStrip :status="status"/>
                    <v-btn
                        color="primary"
                        @click="stopEditing"
                        >Done</v-btn>
                </div>
            </v-scroll-y-transition>
            <v-btn
                color="primary"
                variant="outlined"
                class="mt-4"
                @click="editPassword"
                >
                Change Password
            </v-btn>
        </div>
        <div class="w-100 px-8">
            <div class="d-flex flex-row justify-space-between align-center">
                <span class="my-organizations-title">My organizations</span>
                <v-btn
                    color="primary"
                    prepend-icon="mdi-plus"
                    @click="createOrganization"
                    >
                    Add Organization
                </v-btn>
            </div>
            <v-row class="org-memberships-grid">
                <v-col
                    v-for="membership in memberships"
                    :key="membership.id"
                    >
                    <ItemOrganization
                        :organization="membership.organization"
                        @click="router.push(`/organizations/${membership.organization?.id}`)"
                        />
                </v-col>
            </v-row>
        </div>
    </div>
    <PasswordChangeDialog
        :user-id="currentUser?.id"
        v-model="editingPassword"
        />
</template>

<style>
    .org-memberships-grid {
        display: grid !important;
        grid-template-columns: repeat(4, 1fr);
    }
    .profile-column {
        background-color: #F5F3F3;
    }
    .profile-user-avatar {
        aspect-ratio: 1/1;
        max-width: 16rem;
    }
    .profile-display-name {
        font-size: large;
        font-weight: 700;
    }
    .profile-username {
        font-size: small;
        font-weight: normal;
    }
    .my-organizations-title {
        font-size: larger;
        font-weight: 700;
    }
</style>
