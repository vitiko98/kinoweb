import axiosInstance from "../axios/axiosInstance";

async function searchMedia(search: string) {
    const request = {
        "q": search,
        "limit": 10,
        "offset": 0
    }
    try {
        const response = await axiosInstance.get('/media', { params: request })
        return response.data
    } catch (error) {
        console.error("Error fetching media:", error)
        throw error
    }
}

async function searchQuote(id: number, search: string) {
    const request = {
        "q": search,
        "limit": 10,
        "offset": 0
    }
    try {
        const response = await axiosInstance.get(`/media/${id}`, { params: request });
        return response.data
    } catch (error) {
        console.error("Error fetching quote:", error)
        throw error
    }
}

export { searchMedia, searchQuote }