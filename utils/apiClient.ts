import axios from "axios";
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from "expo-router";

export const tokenKeyName = "token";

let API_URL: string;
if (Constants.expoConfig && Constants.expoConfig.extra && Constants.expoConfig.extra.API_URL) {
  API_URL = Constants.expoConfig.extra.API_URL;
} else {
  throw new Error('API_URL is not defined in expo config');
}

export const apiClient = axios.create({
    baseURL: API_URL,
    // baseURL: "http://10.111.98.222:5050",
});

apiClient.interceptors.request.use(async (config) => {
    const token = await getToken();
    if (token) {
        config.headers.set("Authorization", `Bearer ${token}`);
    }
    return config;
});


export async function getToken() {    
    return await AsyncStorage.getItem(tokenKeyName);
}

export async function setToken(token: string) {
    await AsyncStorage.setItem(tokenKeyName, token);
}

export async function clearToken() {
    await AsyncStorage.removeItem(tokenKeyName);
}

export async function isTokenExpired(): Promise<boolean> {
    const token = await AsyncStorage.getItem(tokenKeyName);
    try {
        if (!token) return true;
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (!payload.exp) return true;
        // exp is in seconds, Date.now() is in ms
        return Date.now() >= payload.exp * 1000;
    } catch (e) {
        return true; // treat invalid token as expired
    }
}

export async function verifyToken(): Promise<void> {
    const isExpired = await isTokenExpired();
    if (isExpired) {
        console.log('Token is expired');
        // router.replace('/login');
    } else {
        console.log('Token is valid');
    }
}
