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
        const response = await axiosInstance.get(`/media/${id}/suggestions`, { params: request });
        return response.data
    } catch (error) {
        console.error("Error fetching quote:", error)
        throw error
    }
}

async function getFrame(id:number, timestamp:number) {
    const request = {
        "ms": timestamp,
        "type": "png"
    }
    try {
        const response = await axiosInstance.get(`/media/${id}/frame`, { params: request });
        return response.data
    } catch (error) {
        console.error("Error fetching frame:", error)
        throw error
    }
}

export { searchMedia, searchQuote, getFrame }