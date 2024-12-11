<script setup lang="ts">
import type { AxiosInstance } from 'axios';
import { computed, inject, ref, watch } from 'vue';

    const apiClient = inject<AxiosInstance>("api");
    const props = defineProps({
        userId: {
            type: [Number, String],
            required: false
        }
    });

    const emit = defineEmits(["saved"]);

    const open = defineModel<boolean>();

    const password = ref<string>();
    const confirmPassword = ref<string>();
    const loading = ref<boolean>(false);
    const saveingPassword = ref<boolean>(false);
    const show1 = ref<boolean>(false);

    const passwordMatch = computed<boolean>(() => confirmPassword.value == password.value && password.value != "" && password.value !== undefined );

    function stopEditPassword() {
        open.value = false;
    }

    async function savePassword() {
        if(props.userId ===undefined)
            return;
        loading.value = true;
        try
        {
            await apiClient?.put(`/users/${props.userId}`,{
                password: password.value
            });
            open.value = false;
            emit("saved");
        }
        finally
        {
            loading.value = false;
        }
    }

    watch(open, (value: boolean|undefined) => {
        if(value != true)
            return;
        password.value = "";
        confirmPassword.value = "";
    });
</script>
<template>
    <v-dialog max-width="25vw" v-model="open">
        <template #default>
            <v-card>
                <v-card-text>
                    <span>Change password</span>
                        <v-text-field
                            :type="show1 ? 'text' : 'password'"
                            label="password"
                            :append-inner-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                            @click:append-inner="show1 = !show1"
                            variant="underlined"
                            v-model="password"
                        />
                            
                        <v-text-field
                            type="password"
                            label="confirm password"
                            variant="underlined"
                            v-model="confirmPassword"
                        />
                </v-card-text>
                <v-card-actions>
                    <v-btn @click="stopEditPassword">Cancel</v-btn>
                    <v-btn color="primary" :loading="loading" @click="savePassword" :disabled="!passwordMatch">Save Password</v-btn>
                </v-card-actions>
            </v-card>
        </template>
    </v-dialog>
</template>