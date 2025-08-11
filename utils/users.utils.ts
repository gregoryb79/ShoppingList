import Constants from 'expo-constants';

export type User = {
  _id: string;
  avatar?: string;
  email?: string;
  name: string;
  password?: string;
};

let API_URL: string;
if (Constants.expoConfig && Constants.expoConfig.extra && Constants.expoConfig.extra.API_URL) {
  API_URL = Constants.expoConfig.extra.API_URL;
} else {
  throw new Error('API_URL is not defined in expo config');
}

export async function fetchUsers(): Promise<User[]> {
    console.log('Fetching users from:', API_URL);
    try {
        const response = await fetch(`${API_URL}/users`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const result = await response.json();
        console.log('Fetched users:', result);
        return result;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
}
