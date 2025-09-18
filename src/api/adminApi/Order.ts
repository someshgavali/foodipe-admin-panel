import axiosInstance from "../axiosInstance";

const getAllOrdersByCompany = async(canteenId:any)=>{
    const response = await axiosInstance.get(`cart/getAllOrderByCanteenId/${canteenId}`)
    return response.data
}

const getOrderByOrderId = async (orderId : any)=>{
    const response = await axiosInstance.get(`cart/getOrderByOrderId/${orderId}`)
    return response.data
}

export {getAllOrdersByCompany, getOrderByOrderId}