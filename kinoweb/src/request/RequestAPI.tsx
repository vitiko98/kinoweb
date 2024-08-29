import axiosInstance from "../axios/axiosInstance";

async function searchMedia(search: string) {
    const request = {
        "q": search,
        "limit": 10,
        "offset": 0
    }
    // Console log url 
    console.log(axiosInstance.getUri({ url: '/media', params: request }))
    
    try {
        const response = await axiosInstance.get('/media', { params: request })
        return response.data
    } catch (error) {
        console.error("Error fetching media:", error)
        throw error
    }
}

export { searchMedia }