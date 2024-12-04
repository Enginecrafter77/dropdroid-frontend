<script setup lang="ts">
	import { RouterView, useRouter } from "vue-router";
	import axios, { type AxiosInstance, type AxiosRequestHeaders, type InternalAxiosRequestConfig } from "axios";
	import { onMounted, provide, ref, type Ref } from "vue";
	import { LoginResponse, type User, type UserInterface } from "./types";
	import Cookies from "js-cookie";

	const TOKEN_COOKIE_NAME = "API-TOKEN";
	function authorizeRequest(this: InternalAxiosRequestConfig, data: unknown, headers: AxiosRequestHeaders)
	{
		const token = Cookies.get(TOKEN_COOKIE_NAME);
		if(token !== undefined)
			headers["Authorization"] = `Bearer ${token}`;
		return JSON.stringify(data);
	}

	const router = useRouter();

	const apiClient: AxiosInstance = axios.create({
		baseURL: import.meta.env.VITE_BACKEND_URL + "/api/v2",
		transformRequest: authorizeRequest,
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json"
		}
	});
	provide<AxiosInstance>("api", apiClient);

	const currentUser = ref<User>();
	provide<Ref<User|undefined>>("currentUser", currentUser);

	async function login(username: string, password: string)
	{
		const response = await apiClient.post<LoginResponse>("/login", {
			username: username,
			password: password
		});
		Cookies.set(TOKEN_COOKIE_NAME, response.data.token);
		await loadUser();
	}

	async function logout()
	{
		Cookies.remove(TOKEN_COOKIE_NAME);
	}

	async function loadUser()
	{
		const response = await apiClient.get("/me");
		currentUser.value = response.data;
	}

	const userInterface: UserInterface = {
		user: currentUser,
		login: login,
		logout: logout,
		fetchUser: loadUser
	};
	provide<UserInterface>("userInterface", userInterface);

	async function tryLoadUser()
	{
		try
		{
			await loadUser();
		}
		catch
		{
			router.push("/login");
		}
	}

	onMounted(() => {
		tryLoadUser();
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
