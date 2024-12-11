<script setup lang="ts">
    import { User, type UserInterface } from '@/types';
    import { computed, inject } from 'vue';
    import { useRouter } from 'vue-router';

    const userInterface = inject<UserInterface>("userInterface");
    const currentUser = computed<User|undefined>(() => userInterface?.user.value);
    const router = useRouter();

    const tab = defineModel("tab");
    defineProps({
        tabs: {
            type: Boolean,
            required: false,
            default: false
        },
        search: {
            type: Boolean,
            required: false,
            default: false
        }
    });

    function toDashboard()
    {
        console.log("Redirect to dashboard");
        router.push("/");
    }

    async function logout()
    {
        await userInterface?.logout();
        router.push("/login");
    }
</script>

<template>
    <div class="w-100 d-flex flex-row justify-around align-center px-4">
        <div class="d-flex flex-row flex-1-0 justify-start align-center ga-4 py-4 cursor-pointer" @click="toDashboard">
            <v-img aspect-ratio="1/1" :inline="true" class="page-icon" rounded="circle" src="/logo.png"/>
            <span class="page-title">DropDroid</span>
        </div>
        <div class="flex-1-1" v-if="tabs">
            <v-tabs
                v-model="tab"
                align-tabs="center"
                >
                <v-tab :value="1">Explore</v-tab>
                <v-tab :value="2">Organizations</v-tab>
            </v-tabs>
        </div>
        <div class="h-100 d-flex flex-row flex-1-0 justify-end align-center ga-4 py-4">
            <v-text-field class="h-fill flex-1-0" label="Search" variant="outlined" density="comfortable" append-inner-icon="mdi-magnify" hide-details v-if="search"/>
            <v-menu>
                <template v-slot:activator="{ props }">
                    <v-btn icon variant="tonal">
                        <v-img
                            aspect-ratio="1/1"
                            :inline="true"
                            class="user-avatar flex-0-0"
                            rounded="circle"
                            v-bind="props"
                            :src="currentUser?.avatar_url">
                            <template #placeholder>
                                <v-img src="/logo.png"/>
                            </template>
                        </v-img>
                    </v-btn>
                </template>
                <v-list>
                    <v-list-item
                        prepend-icon="mdi-account"
                        to="/profile"
                        link
                        >
                        <v-list-item-title>My Profile</v-list-item-title>
                    </v-list-item>
                    <v-list-item
                        prepend-icon="mdi-logout"
                        link
                        @click="logout"
                        >
                        <v-list-item-title>Logout</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
        </div>
    </div>
</template>

<style>
    .page-title {
        font-size: 1.5rem;
        font-weight: 500;
    }
    .page-icon {
        width: 4rem;
        height: 4rem;
    }
    .user-avatar {
        width: 3rem;
        height: 3rem;
    }
</style>
