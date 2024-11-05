<script setup lang="ts">
    import ToolbarComponent from '@/components/ToolbarComponent.vue';
import { type AxiosInstance } from 'axios';
import moment from 'moment';
    import { inject, reactive, ref, shallowRef, toRef, watch, type Ref } from 'vue';

    const apiClient = inject<AxiosInstance>("api");

    const props = defineProps({
        applicationId: {
            type: Number
        }
    });
    const applicationId: Ref<number|undefined> = toRef(props.applicationId);
    const application = reactive({
        id: 0,
        name: "",
        namespace: "",
        description: "",
        icon_url: "",
        organization: {
            id: 0,
            slug: "",
            name: ""
        }
    });
    const comments = shallowRef();
    const newCommentContent = ref();
    const submittingComment = ref<boolean>(false);

    async function loadApplication(appId: number)
    {
        if(apiClient == null)
            return;
        const response = await apiClient.get(`/applications/by_id/${appId}`);
        console.log(response);
        application.id = response.data.id;
        application.name = response.data.name;
        application.namespace = response.data.namespace;
        application.icon_url = response.data.icon_url;
        application.description = response.data.description;
        application.organization.id = response.data.organization.id;
        application.organization.slug = response.data.organization.slug;
        application.organization.name = response.data.organization.name;
        await loadComments();
    }

    async function loadComments()
    {
        if(apiClient == null)
            return;
        const response = await apiClient.get(`/applications/by_id/${application.id}/comments?count=100`);
        const commentList = response.data.data;
        commentList.sort((a: {created_at: number}, b: {created_at: number}) => {
            const aD = moment(a.created_at);
            const bD = moment(b.created_at);
            if(aD.isBefore(bD))
                return 1;
            if(aD.isAfter(bD))
                return -1;
            return 0;
        });
        comments.value = commentList;
    }

    async function submitComment()
    {
        if(apiClient == null)
            return;
        try
        {
            submittingComment.value = true;
            await apiClient.post(`/applications/by_id/${application.id}/comments`, {content: newCommentContent.value});
            await loadComments();
        }
        finally
        {
            submittingComment.value = false;
            newCommentContent.value = "";
        }
    }

    watch(applicationId, (value) => {
        if(value === undefined)
            return;
        loadApplication(value);
    }, {immediate: true});
</script>

<template>
    <ToolbarComponent/>
    <v-container>
        <div class="d-flex flex-row align-center justify-space-between mt-8">
            <div class="d-flex flex-row align-center justify-start ga-8">
                <v-img
                    rounded="circle"
                    class="app-icon"
                    :src="application.icon_url"
                    :inline="true" />
                <div class="d-flex flex-column align-start justify-center">
                    <span class="app-title">{{ application.name }}</span>
                    <span class="app-namespace">{{ application.namespace }}</span>
                    <span class="app-publisher text-primary cursor-pointer">
                        {{ application.organization.name }}
                    </span>
                </div>
            </div>
            <div class="d-flex flex-column align-center justify-space-around ga-4">
                <v-btn color="primary">
                    Install
                </v-btn>
                <v-btn variant="text">
                    Packages
                </v-btn>
            </div>
        </div>
        <div class="w-full mt-4">
            <h2>Description</h2>
            <p>
                {{ application.description }}
            </p>
        </div>
        <div class="w-full mt-4">
            <h2>Comments</h2>
            <div class="d-flex flex-row align-center ga-2 mt-4">
                <v-text-field
                    variant="outlined"
                    label="New comment"
                    placeholder="Add comment..."
                    hide-details
                    v-model="newCommentContent"
                    :disabled="submittingComment"
                    />
                <v-btn
                    icon="mdi-send"
                    @click="submitComment"
                    :loading="submittingComment"
                    />
            </div>
            <div class="d-flex flex-column align-stretch justify-start ga-2 mt-4">
                <div
                    class="comment-box d-flex flex-row justify-start align-center ga-4"
                    v-for="comment of comments"
                    :key="comment.id"
                    >
                    <div class="d-flex flex-column align-center justify-center ga-2">
                        <v-avatar
                            rounded="circle"
                            :image="comment.user.avatar_url"
                            size="64"
                            />
                        <span class="comment-author-name">{{ comment.user.display_name }}</span>
                    </div>
                    <span>{{ comment.content }}</span>
                </div>
            </div>
        </div>
    </v-container>
</template>

<style>
    .app-icon {
        width: 10rem;
        height: 10rem;
    }
    .app-title {
        font-size: 2rem;
        font-weight: bold;
    }
    .app-namespace {
        font-weight: lighter;
    }
    .app-publisher {
        font-weight: normal;
    }
    .comment-box {
        background-color: #F5F5F5;
        border-radius: 0.5rem;
        padding: 1rem;
    }
    .comment-author-name {
        font-size: 0.75rem;
    }
</style>
