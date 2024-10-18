import apiClient from "./api"

const getPersonalBuyOrder = async () => {
    const response = await apiClient.get(`/order/get-personal-buy-order`)
    return response.data
}


export { getPersonalBuyOrder }