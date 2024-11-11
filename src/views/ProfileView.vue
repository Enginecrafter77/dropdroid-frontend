<script setup lang="ts">
    import ItemOrganization from '@/components/ItemOrganization.vue';
import ToolbarComponent from '@/components/ToolbarComponent.vue';
    import { type OrganizationMembership, type PaginationResponse, type User } from '@/types';
    import { type AxiosInstance } from 'axios';
    import { type Ref, inject, computed, shallowRef, watch } from 'vue';

    const currentUser = inject<Ref<User|undefined>>("currentUser");
    const apiClient = inject<AxiosInstance>("api");
    const userHandle = computed(() => `@${currentUser?.value?.username}`);
    const memberships = shallowRef<OrganizationMembership[]>([]);

    if(currentUser === undefined)
        throw new Error("currentUser not injected");

    async function loadMemberships()
    {
        const response = await apiClient?.get<PaginationResponse<OrganizationMembership>>(`/users/${currentUser?.value?.id}/organizations?count=100`);
        if(response == null)
            return;
        memberships.value = response.data.data;
    }

    watch(currentUser, () => {
        loadMemberships();
    }, {immediate: true});
</script>

<template>
    <ToolbarComponent/>

    <div class="d-flex fill-height flex-row justify-start align-stretch">
        <div class="profile-column d-flex fill-height flex-column justify-start align-center pa-8">
            <div class="profile-user-avatar">
                <v-img
                    rounded="lg"
                    :src="currentUser?.avatar_url"
                    />
            </div>
            <span class="profile-display-name">{{ currentUser?.display_name }}</span>
            <span class="profile-username text-secondary">{{ userHandle }}</span>
        </div>
        <div class="w-100 px-8">
            <div class="d-flex flex-row justify-space-between align-center">
                <span class="my-organizations-title">My organizations</span>
                <v-btn
                    color="primary"
                    prepend-icon="mdi-plus"
                    to="/add-organization"
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
                        :icon="membership.organization.icon_url"
                        :name="membership.organization.name"
                        :slug="membership.organization.slug"
                        />
                </v-col>
            </v-row>
        </div>
    </div>
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
        width: 16rem;
        margin-bottom: 2rem;
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
