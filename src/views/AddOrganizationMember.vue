<script setup lang="ts">
import ItemUser from '@/components/ItemUser.vue';
import type { OrganizationMembership, PaginationResponse, User } from '@/types';
import { mapByProperty } from '@/utils';
import { computed } from '@vue/reactivity';
import type { AxiosInstance } from 'axios';
import { isArrowFunction } from 'typescript';
import { inject, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';


    const apiClient = inject<AxiosInstance>("api"); 
    const router = useRouter();
    const props = defineProps({
        organizationId: {
            type: [Number, String],
            required: true
        }
    });

    const users = ref<User[]>([]);

    const filteredUsers = computed<User[]>(() => {
        if(search.value === "")
            return users.value;
        return Array.from(users.value.filter((f) => f.username.includes(search.value) || f.display_name.includes(search.value)));
    });
    const search = ref<string>("");
    async function loadData(){
        if (apiClient === undefined)
        {
            return;
        }
        const responseMembers = await apiClient.get<PaginationResponse<OrganizationMembership>>(`/organizations/${props.organizationId}/memberships?count=1000`);
        const members = mapByProperty(responseMembers.data.data, (m) => m.user?.id);

        const responseUsers = await apiClient.get<PaginationResponse<User>>(`/users?count=1000`); 
        users.value = Array.from(responseUsers.data.data.filter((u)=>!members.has(u.id)));
    }

    async function createMembership(user: User){
        await apiClient?.post<OrganizationMembership>(`/organizations/${props.organizationId}/memberships`,{
            user_id: user.id
        });
        router.back();
    }

    watch(()=>props.organizationId, (value: number|string)=>{
        loadData();
    }, {immediate: true});
</script>
<template>
    <NavigationToolbar/>
    <v-container>
        <v-row>
            <v-col cols="12">
                <div class="d-flex flex-column justify-start align-stretch ga-4">
                    <span class="text-h3 text-center">Add member</span>
                    
                </div>
            </v-col>
            <v-col cols="12">
                <div class="d-flex flex-column justify-start align-center ga-4">
                    <v-text-field
                        color="primary"
                        label="Search"
                        width="100%"
                        max-width="40rem"
                        variant="outlined"
                        prepend-inner-icon="mdi-magnify"
                        v-model="search"
                    />
                </div>
            </v-col>
            <v-col
                v-for="user of filteredUsers"
                md="6"
                :key="user.id"
                cols="12"
                >
                <div class="d-flex flex-column align-stretch justify-center pa-2">
                    <ItemUser
                        :user="user"
                        @click="createMembership(user)"
                    />
                </div>
            </v-col>
        </v-row>
    </v-container>
</template>
