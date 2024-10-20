import apiClient from "./api"


const getPersonalAddress = async () => {
    try {
        const response = await apiClient.get('/address/get-personal-address')
        return response.data
    } catch (error) {
        return error
    }
}

const addAddress = async (address: any) => {
    try {
        const response = await apiClient.put('/address/add-address', address)
        return response.data
    } catch (error) {
        return error
    }
}

export { getPersonalAddress, addAddress }