import apiClient from "./api";

export const getAuctionByFlowerId = async (flowerId: string) => {
    try {
        const response = await apiClient.get(`/auction/get-by-flowerId/${flowerId}`);
        return response.data;
    } catch (error) {
        return error
    }
}

export const placeBid = async (auctionId: string, amount: number) => {
    const response = await apiClient.post('/auction/bid', { auctionId, amount });
    return response.data;
}
