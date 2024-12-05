import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: "/",
			name: "home",
			component: () => import("../views/DashboardView.vue")
		},
		{
			path: "/applications/:applicationId",
			name: "application",
			props: true,
			component: () => import("../views/ApplicationView.vue")
		},
		{
			path: "/organizations/:organizationId",
			name: "organization",
			props: true,
			component: () => import("../views/OrganizationView.vue")
		},
		{
			path: "/profile",
			name: "profile",
			component: () => import("@/views/ProfileView.vue")
		},
		{
			path: "/login",
			name: "login",
			component: () => import("../views/LoginView.vue")
		},
		{
			path: "/register",
			name: "register",
			component: () => import("../views/RegisterView.vue")
		},
		{
			path: "/applications/:applicationId/edit",
			name: "edit-application",
			props: true,
			component: () => import("../views/EditApplicationView.vue")
		},
		{
			path: "/applications/:applicationId/packages",
			name: "list-application-packages",
			props: true,
			component: () => import("../views/PackageListView.vue")
		},
		{
			path: "/organizations/:organizationId/edit",
			name: "edit-organization",
			props: true,
			component: () => import("../views/EditOrganizationView.vue")
		},
		{
			path: "/organizations/:organizationId/add-membership",
			name: "add-organization-member",
			props: true,
			component: () => import("../views/AddOrganizationMember.vue")
		},
	]
});

export default router;
