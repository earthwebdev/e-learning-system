import axios from 'axios';
const SERVER_API_URL = import.meta.env.VITE_SERVER_URL; //+'/api/v1'
export const getPostDatasFromAxios = async(url: string, data: any) => {
    
    //console.log(API_URL);
    try {
        const response = await axios.post(SERVER_API_URL+url, data);
        //console.log(responseData);
        return response.data;
        
    } catch (error: any) {
        //return error;    
        return (error.response.data.message);
    }
}