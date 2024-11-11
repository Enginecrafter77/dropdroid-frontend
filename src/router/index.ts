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
			path: "/about",
			name: "about",
			// route level code-splitting
			// this generates a separate chunk (About.[hash].js) for this route
			// which is lazy-loaded when the route is visited.
			component: () => import("../views/AboutView.vue")
		},
		{
			path: "/login",
			name: "login",
			component: () => import("../views/LoginView.vue")
		},
		{
			path: "/add-application",
			name: "add-application",
			component: () => import("../views/AddApplicationView.vue")
		},
		{
			path: "/add-organization",
			name: "add-organization",
			component: () => import("../views/AddOrganizationView.vue")
		},
		{
			path: "/register",
			name: "register",
			component: () => import("../views/RegisterView.vue")
		},
	]
});

export default router;
