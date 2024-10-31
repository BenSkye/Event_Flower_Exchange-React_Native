import apiClient from "./api"

const getPersonalBuyOrder = async () => {
    const response = await apiClient.get(`/order/get-personal-buy-order`)
    return response.data
}
const getOrderbyId = async (id: string) => {
    const response = await apiClient.get(`/order/get-order-by-id/${id}`)
    return response.data
}
const getOrderbyOrdercode = async (orderCode: string) => {
    const response = await apiClient.get(`/order/get-order-by-ordercode/${orderCode}`)
    return response.data
}
const getPersonalSellOrder = async () => {
    const response = await apiClient.get(`/order/get-personal-sell-order`)
    return response.data
}
const changeOrderStatus = async (id: string, status: string) => {
    const response = await apiClient.patch(`/order/change-order-status/${id}`, { status })
    return response.data
}

export { getPersonalBuyOrder, getOrderbyOrdercode, getOrderbyId, getPersonalSellOrder, changeOrderStatus }