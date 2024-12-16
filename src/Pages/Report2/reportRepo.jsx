import { indexData } from "./index_data";

export const reportRepo = {
    all_data: async (serverUrl, token) => {
        return await indexData(serverUrl, token);
    },
}