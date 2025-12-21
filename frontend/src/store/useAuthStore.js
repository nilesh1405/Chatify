import {create} from 'zustand';
import {axiosInstance} from '../lib/axios.js';
import toast from 'react-hot-toast';
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "/";

export const useAuthStore = create((set,get)=>({
    authUser:null,
    isCheckingAuth:true,
    isSigningUp:false,
    isLoggingIn:false,
    socket:null,
    onlineUsers: [],

    checkAuth:async ()=>{
        try {
            const res = await axiosInstance.get('/auth/check');
            set({authUser:res.data})
            get().connectSocket();
        } catch (error) {
            set({authUser:null});
        }finally{
            set({isCheckingAuth:false});
        }
    },

    signUp: async (data)=>{
        set({isSigningUp:true});
        try{
            const res = await axiosInstance.post('/auth/signup', data);
            set({authUser:res.data});
            toast.success('Account Created successfully!');
            get().connectSocket();
        }catch(error){
            console.error(error);

            const message =
                error?.response?.data?.message ||
                error?.message ||
                "Login failed";

            toast.error(message);
        }finally{
            set({isSigningUp:false});
        }
    },

    login: async (data)=>{
        set({isLoggingIn:true});
        try{
            const res = await axiosInstance.post('/auth/login', data);
            set({authUser:res.data});
            toast.success('Logged in successfully!');
            
            get().connectSocket();
        }catch(error){
            console.error(error);

            const message =
                error?.response?.data?.message ||
                error?.message ||
                "Login failed";

            toast.error(message);
        }finally{
            set({isLoggingIn:false});
        }
    },

    logout: async ()=>{
        try{
            await axiosInstance.post('/auth/logout');
            set({authUser:null});
            toast.success('Logged out successfully!');
            get().disconnectSocket();
        }catch(error){
            toast.error('Failed to logout. Please try again.');
        }
    },

    updateProfile: async (data)=>{
        try{
            const res = await axiosInstance.put('/auth/update-profile', data);
            set({authUser:res.data});
            toast.success('Profile updated successfully!');
        }catch(error){
            toast.error(error.response.data.message);
        }
    },

    connectSocket: () => {
        const { authuser } = get(); // fix the variable name
        if (!authuser || get().socket?.connected) return;

        const socket = io(BASE_URL, {
            withCredentials: true,
        });

        set({ socket });

        socket.on("connect", () => console.log("Socket connected:", socket.id));
        socket.on("connect_error", (err) => console.error("Socket connection error:", err));

        socket.on("getOnlineUsers", (userIds) => {
            set({ onlineUsers: userIds });
        });
    },

    disconnectSocket: () => {
        if (get().socket?.connected) get().socket.disconnect();
    },

}))