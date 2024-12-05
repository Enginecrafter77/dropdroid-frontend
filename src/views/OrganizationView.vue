<script setup lang="ts">
    import ItemApplication from '@/components/ItemApplication.vue';
    import ItemOrganization from '@/components/ItemOrganization.vue';
import OrganizationMember from '@/components/OrganizationMember.vue';
    import ToolbarComponent from '@/components/ToolbarComponent.vue';
    import type { Application, Organization, OrganizationMembership, PaginationResponse } from '@/types';
    import type { AxiosInstance } from 'axios';
    import { inject, ref, watch } from 'vue';
    import { useRouter } from 'vue-router';
    
    const apiClient = inject<AxiosInstance>("api");
    const router = useRouter();
    const props = defineProps({
        organizationId: {
            type: [Number, String],
            required: true
        }
    
    });

    const tab = ref<string>("applications");
    const applications = ref<Application[]>([]);
    const members = ref<OrganizationMembership[]>([]);
    const appNamespace = ref<string>("");
    const dialogLoading = ref<boolean>(false);
    const dialogOpen = ref<boolean>(false);

    const organization = ref<Organization>({
        id: 0,
        slug: "",
        name: "",
        description: undefined,
        icon_url: ""
    });

    async function loadData() {
        if (apiClient === undefined)
        {
            return;
        }
        const response = await apiClient.get<Organization>(`/organizations/${props.organizationId}`);
        organization.value = response.data;

        const responseApp = await apiClient.get<PaginationResponse<Application>>(`/applications?count=1000`);
        applications.value = Array.from(responseApp.data.data.filter((a)=>a.organization?.id==props.organizationId));

        const responseMembers = await apiClient.get<PaginationResponse<OrganizationMembership>>(`/organizations/${props.organizationId}/memberships?count=1000`);
        members.value = Array.from(responseMembers.data.data.filter((m)=>m.organization?.id==props.organizationId));
    }

   function cancelApplication() {
        appNamespace.value = "";
        dialogOpen.value = false;
   }

    async function createApplication() {
        try
        {
            dialogLoading.value = true;
            const createResponse = await apiClient?.post<Application>(`/applications`,{
                namespace: appNamespace.value,
                organiation_id: props.organizationId,
                name: "Example Name",
                description: "description"
            });
            dialogOpen.value = false;
            router.push(`/applications/${createResponse?.data.id}/edit`);
        }
        finally
        {
            dialogLoading.value = false;
            appNamespace.value = "";
        }
    }

    function deleteMember(member: OrganizationMembership){
        members.value = Array.from(members.value.filter((m) => m.id != member.id));
    }
    watch(()=>props.organizationId, (value: number|string)=>{
        loadData();
    }, {immediate: true});
</script>
<template>
    <ToolbarComponent/>
    <v-container>
        <v-row>
            <v-col cols="12" sm="4" md="2" align="center" align-sm="end">
                <div class="organization-icon">
                    <v-img :src="organization?.icon_url" rounded="lg">
                        <template #placeholder>
                            <v-img src="/logo.svg" />
                        </template>
                    </v-img>
                </div>
            </v-col>
            <v-col cols="12" sm="8" md="7">
                <div class="d-flex flex-column justify-center align-center align-sm-start ga-2">
                    <div class="d-flex flex-row justify-start align-center ga-2">
                        <span class="text-h3">{{ organization?.name }}</span>
                        <v-btn
                            :to="`/organizations/${organization?.id}/edit`"
                            variant="text"
                            color="secondary"
                            icon="mdi-pencil"
                            />
                        <v-btn
                            variant="text"
                            color="error"
                            icon="mdi-delete"
                            />
                    </div>
                    <div class="d-flex flex-row justify-start align-center">
                        <span class="text-secondary font-weight-medium">{{ organization?.description }}</span>
                    </div>
                </div>
            </v-col>
            <v-col cols="12" md="3">
                <div class="d-flex flex-row justify-space-evenly justify-md-end align-center ga-2">
                    <v-btn
                        
                        rounded="lg"
                        elevation="8"
                        @click="router.push(`/organizations/${props.organizationId}/add-membership`)"
                        >
                        Add Member
                    </v-btn>
                    <v-dialog max-width="25vw" v-model="dialogOpen">
                        <template #activator="{ props }">
                            <v-btn
                                rounded="lg"
                                elevation="8"
                                v-bind="props"
                                >
                                Add Application
                            </v-btn>
                        </template>
                        <template #default>
                            <v-card>
                                <v-card-text>
                                    <v-text-field
                                        color="primary"
                                        label="Application ID"
                                        v-model="appNamespace"
                                        />
                                    <span class="text-error"><b>Warning:</b> You <b>WILL NOT</b> be able to change this later.</span>
                                </v-card-text>
                                <v-card-actions>
                                    <v-btn @click="cancelApplication">Cancel</v-btn>
                                    <v-btn color="primary" :loading="dialogLoading" @click="createApplication">Create</v-btn>
                                </v-card-actions>
                            </v-card>
                        </template>
                    </v-dialog>
                </div>
            </v-col>
        </v-row>
    </v-container>
    <div class="w-100 d-flex flex-row justify-center align-center">
        <v-tabs v-model="tab">
            <v-tab value="members">Members</v-tab>
            <v-tab value="applications">Applications</v-tab>
        </v-tabs>
    </div>
    <v-tabs-window v-model="tab">
        <v-tabs-window-item value="members">
            <v-container>
                <v-row>
                    <v-col
                        cols="12"
                        lg="6"
                        v-for="member of members"
                        :key="member.id"
                        >
                        <div class="d-flex flex-column align-stretch justify-center pa-2">
                            <OrganizationMember
                                :membership="member"
                                manageable
                                @delete="deleteMember(member)"
                            />
                        </div>
                    </v-col>
                </v-row>
            </v-container>
        </v-tabs-window-item>
        <v-tabs-window-item value="applications">
            <v-container fluid>
                <v-row>
                    <v-col
                        cols="12"
                        md="6"
                        lg="3"
                        v-for="application of applications"
                        :key="application.id"
                        >
                        <div class="d-flex flex-column align-stretch justify-center pa-4">
                            <ItemApplication 
                                :app-id="application.id"
                                :name="application.name"
                                :organization-name="application.organization?.name"
                                :icon="application.icon_url"
                                @click="router.push(`/applications/${application.id}`)"
                            />
                        </div>
                    </v-col>
                </v-row>
            </v-container>
        </v-tabs-window-item>
    </v-tabs-window>
</template>

<style>
    .organization-icon {
        max-width: 50rem;
        aspect-ratio: 1/1;
    }
    .applications-members-grid {
        display: grid !important;
        grid-template-columns: repeat(4, 1fr);
    }
</style>