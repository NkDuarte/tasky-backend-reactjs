import axios from 'axios';
import { _user_data } from '../interfaces/interfaces';

const API_URL = 'https://tasky-backend-nestjs-1.onrender.com';

/*************************/
//? -> API REST USERS
const getUsers = async () => {
    const response = await axios.get(`${API_URL}/users/get-all-users`);
    const {data} = response.data;
    // Convertir el objeto a un array de usuarios con `id`
    const users = Object.keys(data).map((key) => ({
        id: key,
        ...data[key],
    }));

    return users;
};

const getUserById = async (id: string) => {
    const response = await axios.get(`${API_URL}/users/unique-user/${id}`);
    return response.data;
};


const createUser = async (data: _user_data) => {
    const response = await axios.post(`${API_URL}/users/create-user`, data);
    return response.data;
};

const updateUser = async (id: string, data: _user_data) => {
    const response = await axios.patch(`${API_URL}/users/update-user/${id}`, data);
    return response.data;
};

const deleteUser = async (id: string) => {
    const response = await axios.delete(`${API_URL}/users/delete-user/${id}`);
    return response.data;
};

/*************************/
//? API REST SMTP
const sendMessageSms = async (data: any) => {
    const response = await axios.post(`${API_URL}/smtp/send-sms`, data);
    return response.data;
};

export {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    sendMessageSms
}