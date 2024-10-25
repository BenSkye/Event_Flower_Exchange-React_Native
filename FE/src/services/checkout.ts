import apiClient from "./api"


const checkoutFixedFlower = async (flowerId: string, delivery: any) => {
    try {
        const response = await apiClient.post('/checkout/checkout-fixed-flower', { flowerId, delivery })
        return response.data
    } catch (error) {
        return error
    }
}

const checkoutBuyNowAuction = async (auctionId: string, delivery: any) => {
    try {
        const response = await apiClient.post('/checkout/checkout-buy-now-auction', { auctionId, delivery })
        return response.data
    } catch (error) {
        return error
    }
}

const checkPaymentStatus = async (queryParams: Record<string, string>) => {
    try {
        const queryString = new URLSearchParams(queryParams).toString();
        const response = await apiClient.get(`/checkout/handle-payos-return?${queryString}`);
        return response.data;
    } catch (error) {
        return error
    }
};

const cancelPayment = async (queryParams: Record<string, string>) => {
    try {
        const queryString = new URLSearchParams(queryParams).toString();
        const response = await apiClient.get(`/checkout/handle-payos-cancel?${queryString}`);
        return response.data;
    } catch (error) {
        return error
    }
};

const checkBuyNowAuctionPaymentStatus = async (queryParams: Record<string, string>) => {
    try {
        const queryString = new URLSearchParams(queryParams).toString();
        const response = await apiClient.get(`/checkout/handle-buy-now-auction-payos-return?${queryString}`);
        return response.data;
    } catch (error) {
        return error
    }
};

const cancelBuyNowAuctionPayment = async (queryParams: Record<string, string>) => {
    try {
        const queryString = new URLSearchParams(queryParams).toString();
        const response = await apiClient.get(`/checkout/handle-buy-now-auction-payos-cancel?${queryString}`);
        return response.data;
    } catch (error) {
        return error
    }
};

export { checkoutFixedFlower, checkPaymentStatus, cancelPayment, checkBuyNowAuctionPaymentStatus, cancelBuyNowAuctionPayment, checkoutBuyNowAuction }  
