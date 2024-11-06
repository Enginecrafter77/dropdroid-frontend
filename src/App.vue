<script setup lang="ts">
	import { RouterView } from "vue-router";
	import axios, { type AxiosInstance } from "axios";
	import { onMounted, provide, ref, type Ref } from "vue";
	import type { User } from "./types";

	const apiClient: AxiosInstance = axios.create({
		baseURL: import.meta.env.VITE_BACKEND_URL + "/api/v2",
		auth: {
			username: import.meta.env.VITE_BACKEND_USERNAME,
			password: import.meta.env.VITE_BACKEND_PASSWORD
		}
	});
	provide<AxiosInstance>("api", apiClient);

	const currentUser = ref<User>();
	provide<Ref<User|undefined>>("currentUser", currentUser);

	async function loadUser()
	{
		const response = await apiClient.get("/me");
		currentUser.value = response.data;
	}

	onMounted(() => {
		loadUser();
	});
</script>

<template>
	<header>
	</header>
	<v-app>
		<RouterView />
	</v-app>
</template>

<style>
	v-app {
		width: 100vw;
		height: 100vh;
	}
</style>
