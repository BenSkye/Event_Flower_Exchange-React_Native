import apiClient from "./api";

export const getAuctionByFlowerId = async (flowerId: string) => {
    try {
        const response = await apiClient.get(`/auction/get-by-flowerId/${flowerId}`);
        return response.data;
    } catch (error) {
        return error
    }
}