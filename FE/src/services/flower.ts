import apiClient from "./api"

const getFlowers = async (page: number, limit: number, search: string) => {
    const response = await apiClient.get(`/flower/get-list?page=${page}&limit=${limit}&search=${search}`)
    console.log('response', response.data)
    return response.data
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

export { getFlowers, getFlowerById, getCategory, createFlower }