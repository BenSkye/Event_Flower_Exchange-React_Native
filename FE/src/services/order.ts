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

export { getPersonalBuyOrder, getOrderbyOrdercode, getOrderbyId }