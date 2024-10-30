import apiClient from "./api"

const getFlowers = async (page: number, limit: number, search: string) => {
    const response = await apiClient.get(`/flower/get-list?page=${page}&limit=${limit}&search=${search}`)
    console.log('response', response.data)
    return {
        flowers: response.data,
        hasMore: response.data.length === limit
    }
}

const getFlowerById = async (id: string) => {
    const response = await apiClient.get(`/flower/get-flower-by-id/${id}`)
    return response.data
}

const getCategory = async () => {
    const response = await apiClient.get('/category')
    return response.data
}

const createFlower = async (data: any) => {
    const response = await apiClient.post('/flower/create', data)
    return response.data
}

const getFlowerBySellerId = async () => {
    const response = await apiClient.get('/flower/get-flower-by-seller-id')
    return response.data
}

const deleteFlower = async (id: string) => {
    const response = await apiClient.delete(`/flower/delete/${id}`)
    return response.data
}

const updateFlowerById = async (id: string, data: any) => {
    const response = await apiClient.put(`/flower/update/${id}`, data)
    return response.data
}

export { getFlowers, getFlowerById, getCategory, createFlower, getFlowerBySellerId, deleteFlower, updateFlowerById }
