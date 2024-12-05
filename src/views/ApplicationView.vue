<script setup lang="ts">
    import ApplicationComment from '@/components/ApplicationComment.vue';
    import ToolbarComponent from '@/components/ToolbarComponent.vue';
    import router from '@/router';
    import { Application, type Organization, type User } from '@/types';
    import { type AxiosInstance } from 'axios';
    import moment from 'moment';
    import { computed, inject, reactive, ref, toRef, watch, type Ref } from 'vue';

    const apiClient = inject<AxiosInstance>("api");
    const currentUser = inject<Ref<User|undefined>>("currentUser");

    const props = defineProps({
        applicationId: {
            type: Number
        }
    });
    const applicationId: Ref<number|undefined> = toRef(props.applicationId);
    const application = reactive<Application>(new Application());
    const comments = ref();
    const newCommentContent = ref();
    const submittingComment = ref<boolean>(false);

    const appEditLink = computed(() => `/applications/${applicationId.value}/edit`);

    async function loadApplication(appId: number)
    {
        if(apiClient == null)
            return;
        const response = await apiClient.get<Application>(`/applications/by_id/${appId}`);
        Object.assign(application, response.data);
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

    async function goToOrganization(organization: Organization|undefined) {
        if(organization === undefined)
            return;
        router.push(`/organizations/${organization.id}`);
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
                    aspect-ratio="1/1"
                    rounded="circle"
                    class="app-icon"
                    :src="application.icon_url"
                    :inline="true"
                    cover
                    />
                <div class="d-flex flex-column align-start justify-center">
                    <div class="d-flex flex-row justify-start align-center ga-2">
                        <span class="app-title">{{ application.name }}</span>
                        <v-btn
                            variant="plain"
                            icon="mdi-pencil"
                            :to="appEditLink"
                            />
                    </div>
                    <span class="app-namespace">{{ application.namespace }}</span>
                    <span class="app-publisher text-primary cursor-pointer" @click="goToOrganization(application.organization)">
                        {{ application.organization?.name }}
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
                <ApplicationComment
                    v-for="comment of comments"
                    :key="comment.id"
                    :comment-id="comment.id"
                    :author-avatar="comment.user.avatar_url"
                    :author-name="comment.user.display_name"
                    v-model:content="comment.content"
                    :editable="comment.user.id == currentUser?.id"
                    :deletable="comment.user.id == currentUser?.id"
                    @deleted="loadComments"
                    />
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
</style>
