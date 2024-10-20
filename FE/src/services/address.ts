import apiClient from "./api"


const getPersonalAddress = async () => {
    try {
        const response = await apiClient.get('/address/get-personal-address')
        return response.data
    } catch (error) {
        return error
    }
}

export { getPersonalAddress }