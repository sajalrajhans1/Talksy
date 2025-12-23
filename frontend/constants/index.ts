import { Platform } from "react-native";

export const API_URL = Platform.OS === "android" ? "http://192.168.29.253:3000" : "http://192.168.29.253:3000";

export const CLOUDINARY_CLOUD_NAME = "dhck3lyc7";
export const CLOUDINARY_CLOUD_PRESET = "images";