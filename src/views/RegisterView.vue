<script setup lang="ts">
    import type { User, UserInterface } from '@/types';
    import type { AxiosInstance } from 'axios';
    import { computed, inject, ref } from 'vue';
    import { useRouter } from 'vue-router';

    const apiClient = inject<AxiosInstance>("api");
    const userInterface = inject<UserInterface>("userInterface");
    const router = useRouter();

    const username = ref<string>();
    const password = ref<string>();
    const confirmPassword = ref<string>();
    const show1 = ref<boolean>(false);
    const loading = ref<boolean>(false);

    const passwordMatch = computed<boolean>(() => confirmPassword.value == password.value && password.value != "" && password.value !== undefined);

    async function register() {
        if(apiClient === undefined || userInterface === undefined || username.value === undefined || password.value === undefined)
            return;
        try
        {
            loading.value = true;
            await apiClient.post<User>(`/register`, {
                username: username.value,
                display_name: username.value,
                password: password.value
            });
            await userInterface.login(username.value, password.value);
            router.push("/");
        }
        finally
        {
            loading.value = false;
        }
    }
</script>
<template>
    <v-container>
        <v-row>
            <v-col cols="12" md="4" offset-md="4">
                <div class="d-flex flex-column justify-center align-stretch ga-3">
                    <div class="d-flex flex-row flex-1-0 justify-center align-center ga-10 pt-16 pb-8">
                        <v-img aspect-ratio="1/1" :inline="true" class="page-icon" rounded="circle" src="/public/logo.png"/>
                        <span class="page-title">DropDroid</span>
                    </div>

                    <v-text-field 
                        color="primary" 
                        label="Username" 
                        variant="underlined"
                        v-model="username"
                        />
                    <v-text-field
                        :type="show1 ? 'text' : 'password'"
                        label="Password"
                        color="primary" 
                        :append-inner-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                        @click:append-inner="show1 = !show1"
                        variant="underlined"
                        v-model="password"
                        />
                    <v-sheet 
                        :height="8" 
                        rounded 
                        color="green"
                        />
                    <v-text-field 
                        color="primary" 
                        type="password" 
                        label="Confirm password"
                        variant="underlined" 
                        v-model="confirmPassword"
                        />
                    <v-btn 
                        @click="register" 
                        rounded="lg" 
                        elevation="8" 
                        color="primary"
                        :loading="loading"
                        :disabled="!passwordMatch"
                        >
                        Register
                    </v-btn>
                </div>
            </v-col>
        </v-row>
    </v-container>
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
</style>

