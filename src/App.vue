<script setup lang="ts">
	import { RouterView } from "vue-router";
	import axios, { type AxiosInstance } from "axios";
	import { provide } from "vue";

	const api: AxiosInstance = axios.create({
		baseURL: import.meta.env.VITE_BACKEND_URL + "/api/v2",
		auth: {
			username: import.meta.env.VITE_BACKEND_USERNAME,
			password: import.meta.env.VITE_BACKEND_PASSWORD
		}
	});
	provide<AxiosInstance>("api", api);

	console.log(import.meta.env.VITE_BACKEND_URL);
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
