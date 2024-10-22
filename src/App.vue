<script setup lang="ts">
	import { RouterView } from "vue-router";
	import axios, { type AxiosInstance } from "axios";
	import { provide } from "vue";

	const api: AxiosInstance = axios.create({
		baseURL: "http://fitcode.vm:8080/api/v1",
		withCredentials: true
	});
	provide<AxiosInstance>("apiclient", api);
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
