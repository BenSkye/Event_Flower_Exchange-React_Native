import apiClient from "./api"

const getPersonalNotification = async () => {
    const response = await apiClient.get(`/notification/get-personal-notification`)
    return response.data
}


export { getPersonalNotification }