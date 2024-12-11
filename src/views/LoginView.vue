<script setup lang="ts">
    import { type UserInterface } from '@/types';
    import { inject, ref } from 'vue';
    import { useRouter } from 'vue-router';

    const userInterface = inject<UserInterface>("userInterface");
    const router = useRouter();

    const username = ref<string>();
    const password = ref<string>();
    const loggingIn = ref<boolean>(false);

    async function login()
    {
        if(username.value === undefined || password.value === undefined)
            return;
        try
        {
            loggingIn.value = true;
            await userInterface?.login(username.value, password.value);
            router.push("/");
        }
        finally
        {
            loggingIn.value = false;
        }
    }

    window.addEventListener("keydown", (e) => {
        if(e.key != "Enter")
            return;
        login();
    });
</script>

<template>
    <v-container>
        <v-row>
            <v-col cols="12" md="4" offset-md="4">
                <div class="w-100 fill-height d-flex flex-column justify-normal align-stretch ga-2">
                    <div class="d-flex flex-row flex-1-0 justify-center align-center ga-10 pt-16 pb-8">
                        <v-img aspect-ratio="1/1" :inline="true" class="page-icon" rounded="circle" src="/public/logo.png"/>
                        <span class="page-title">DropDroid</span>
                    </div>
                    <v-text-field
                        label="Username"
                        v-model="username"
                        />
                    <v-text-field
                        type="password"
                        label="Password"
                        v-model="password"
                        />
                    <div class="d-flex flex-column flex-sm-row justify-normal justify-sm-center align-stretch align-sm-center ga-2">
                        <v-btn
                            color="primary"
                            :loading="loggingIn"
                            @click="login"
                            >
                            Log in
                        </v-btn>
                        <v-btn
                            to="/register"
                            variant="outlined"
                            color="primary">
                            Register
                        </v-btn>
                    </div>
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

