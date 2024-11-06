<script setup lang="ts">
    import { type AxiosInstance } from 'axios';
    import { inject, ref } from 'vue';

    const apiClient: AxiosInstance|undefined = inject<AxiosInstance>("api");
    const props = defineProps({
        commentId: {
            type: Number
        },
        authorAvatar: {
            type: String
        },
        authorName: {
            type: String
        },
        editable: {
            type: Boolean,
            required: false,
            default: false
        },
        deletable: {
            type: Boolean,
            required: false,
            default: false
        }
    });
    const emit = defineEmits(["deleted"]);
    const content = defineModel<string>("content");

    const editing = ref<boolean>(false);
    const saving = ref<boolean>(false);
    const deleting = ref<boolean>(false);
    const newContent = ref<string>();

    function startEditing()
    {
        editing.value = true;
        newContent.value = content.value;
    }

    function stopEditing()
    {
        editing.value = false;
    }

    async function submitEdit()
    {
        saving.value = true;
        try
        {
            await apiClient?.put(`/comments/${props.commentId}`, {content: newContent.value});
            content.value = newContent.value;
            stopEditing();
        }
        finally
        {
            saving.value = false;
        }
    }

    async function deleteComment()
    {
        deleting.value = true;
        try
        {
            await apiClient?.delete(`/comments/${props.commentId}`);
            emit("deleted");
        }
        finally
        {
            deleting.value = false;
        }
    }
</script>

<template>
    <div class="comment-box d-flex flex-row justify-between align-center" >
        <div class="d-flex flex-row flex-1-1 justify-start align-center ga-4" >
            <div class="d-flex flex-column align-center justify-center ga-2">
                <v-avatar
                    rounded="circle"
                    :image="authorAvatar"
                    size="64"
                    />
                <span class="comment-author-name">{{ authorName }}</span>
            </div>
            <span v-if="!editing">{{ content }}</span>
            <v-text-field
                label="Comment"
                variant="underlined"
                v-model="newContent"
                :disabled="saving"
                v-if="editing"
                />
        </div>
        <div class="d-flex flex-row-reverse justify-normal align-center ga-2">
            <v-btn
                variant="text"
                color="error"
                icon="mdi-delete"
                :loading="deleting"
                v-if="deletable"
                @click="deleteComment"
                />
            <v-btn
                variant="text"
                icon="mdi-pencil"
                v-if="editable && !editing"
                @click="startEditing"
                />
            <v-btn
                variant="text"
                icon="mdi-close"
                v-if="editable && editing"
                @click="stopEditing"
                />
            <v-btn
                variant="text"
                icon="mdi-check"
                v-if="editable && editing"
                :loading="saving"
                @click="submitEdit"
                />
        </div>
    </div>
</template>

<style>
    .comment-box {
        background-color: #F5F5F5;
        border-radius: 0.5rem;
        padding: 1rem;
    }
    .comment-author-name {
        font-size: 0.75rem;
    }
</style>
