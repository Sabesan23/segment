import axios from "axios";
import { api } from "../controller/config";

export const postnewschema = async (payload) => {
    try {
        const response = await axios.post(api, payload);
        if (response.status === 200) {
            return true
        }
    } catch (error) {
        console.error(error);
    }
};