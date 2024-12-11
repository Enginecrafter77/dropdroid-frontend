<script setup lang="ts">
    import ApplicationComment from '@/components/ApplicationComment.vue';
    import ToolbarComponent from '@/components/ToolbarComponent.vue';
    import router from '@/router';
    import { Application, OrganizationMembership, OrganizationRole, type Organization, type User, type Comment, PaginationResponse, Package } from '@/types';
import { downloadFile } from '@/utils';
    import { type AxiosInstance } from 'axios';
    import moment from 'moment';
    import { computed, inject, ref, toRef, watch, type Ref } from 'vue';

    const apiClient = inject<AxiosInstance>("api");
    const currentUser = inject<Ref<User|undefined>>("currentUser");

    const props = defineProps({
        applicationId: {
            type: Number
        }
    });
    const applicationId: Ref<number|undefined> = toRef(props.applicationId);
    const application = ref<Application>();
    const currentUserMembership = ref<OrganizationMembership>();
    const comments = ref<Comment[]>([]);
    const newCommentContent = ref<string>();
    const submittingComment = ref<boolean>(false);
    const deletingApplication = ref<boolean>(false);
    const latestPackage = ref<Package|undefined>();
    const canEdit = computed<boolean>(() => {
        if(currentUserMembership.value === undefined)
            return false;
        return currentUserMembership.value.role == OrganizationRole.ADMIN;
    });

    async function loadApplication(appId: number)
    {
        if(apiClient == null)
            return;
        const applicationResponse = await apiClient.get<Application>(`/applications/by_id/${appId}`);
        const commentsResponse = await apiClient.get<PaginationResponse<Comment>>(`/applications/by_id/${appId}/comments?count=100`);
        const packagesResponse = await apiClient.get<PaginationResponse<Package>>(`/applications/by_id/${appId}/packages?count=100`);

        application.value = applicationResponse.data;
        const commentList = commentsResponse.data.data;
        commentList.sort((a, b) => {
            const aD = moment(a.created_at);
            const bD = moment(b.created_at);
            if(aD.isBefore(bD))
                return 1;
            if(aD.isAfter(bD))
                return -1;
            return 0;
        });
        comments.value = commentList;

        const packages = packagesResponse.data.data;
        packages.sort((a, b) => {
            if(a.version_code != b.version_code)
                return b.version_code - a.version_code;
            const aD = moment(a.created_at);
            const bD = moment(b.created_at);
            if(aD.isBefore(bD))
                return 1;
            if(aD.isAfter(bD))
                return -1;
            return 0;
        });
        latestPackage.value = packages.length > 0 ? packages[0] : undefined;

        await loadMembership(application.value, currentUser?.value);
    }

    async function loadMembership(app: Application, user: User|undefined)
    {
        if(app.organization === undefined || apiClient === undefined || user === undefined)
            return;
        const membershipResponse = await apiClient.get<PaginationResponse<OrganizationMembership>>(`/organizations/${app.organization?.id}/memberships?count=100`);
        currentUserMembership.value = membershipResponse.data.data.filter((m) => m.user?.id == user.id)[0];
    }

    function removeComment(removed: Comment)
    {
        comments.value = Array.from(comments.value.filter((c) => c.id != removed.id));
    }

    async function submitComment()
    {
        if(apiClient == null)
            return;
        try
        {
            submittingComment.value = true;
            const response = await apiClient.post(`/applications/by_id/${application.value?.id}/comments`, {content: newCommentContent.value});
            comments.value.unshift(response.data);
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

    async function deleteApplication()
    {
        try
        {
            deletingApplication.value = true;
            await apiClient?.delete(`/applications/by_id/${props.applicationId}`);
            router.push("/");
        }
        finally
        {
            deletingApplication.value = false;
        }
    }

    function downloadLatestPackage()
    {
        if(latestPackage.value === undefined)
            return;
        downloadFile(latestPackage.value.file_url, `${latestPackage.value.application?.namespace}-${latestPackage.value.version_code}-${latestPackage.value.version_name}.apk`);
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
                    :src="application?.icon_url"
                    :inline="true"
                    cover
                    >
                    <template #placeholder>
                        <v-img src="/logo.png"/>
                    </template>
                </v-img>
                <div class="d-flex flex-column align-start justify-center">
                    <div class="d-flex flex-row justify-start align-center ga-2">
                        <span class="app-title">{{ application?.name }}</span>
                        <v-btn
                            variant="text"
                            icon="mdi-pencil"
                            :to="`/applications/${applicationId}/edit`"
                            v-if="canEdit"
                            />
                        <v-btn
                            variant="text"
                            color="error"
                            icon="mdi-delete"
                            :loading="deletingApplication"
                            @click="deleteApplication"
                            v-if="canEdit"
                            />
                    </div>
                    <span class="app-namespace">{{ application?.namespace }}</span>
                    <span class="app-publisher text-primary cursor-pointer" @click="goToOrganization(application?.organization)">
                        {{ application?.organization?.name }}
                    </span>
                </div>
            </div>
            <div class="d-flex flex-column align-center justify-space-around ga-4">
                <span class="text-subtitle-2 text-secondary" v-if="latestPackage">Version {{ latestPackage.version_name }} ({{ latestPackage.version_code }})</span>
                <v-btn
                    color="primary"
                    @click="downloadLatestPackage"
                    v-if="latestPackage"
                    >
                    Download
                </v-btn>
                <v-btn
                    variant="text"
                    :to="`/applications/${applicationId}/packages`"
                    >
                    Packages
                </v-btn>
            </div>
        </div>
        <div class="w-full mt-4">
            <h2>Description</h2>
            <p>
                {{ application?.description }}
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
                    :author-avatar="comment.user?.avatar_url"
                    :author-name="comment.user?.display_name"
                    v-model:content="comment.content"
                    :editable="comment.user?.id == currentUser?.id"
                    :deletable="comment.user?.id == currentUser?.id"
                    @deleted="removeComment(comment)"
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
