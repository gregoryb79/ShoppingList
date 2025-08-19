import axios from "axios";
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const tokenKeyName = "token";

let API_URL: string;
if (Constants.expoConfig && Constants.expoConfig.extra && Constants.expoConfig.extra.API_URL) {
  API_URL = Constants.expoConfig.extra.API_URL;
} else {
  throw new Error('API_URL is not defined in expo config');
}

export const apiClient = axios.create({
    // baseURL: API_URL,
    baseURL: "http://192.168.1.225:5050",
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
