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

export const postDataWithJWT = async(url: string, data: any, jwtToken: string) => {
    
    //console.log(API_URL);
    try {
        const response = await axios.post(SERVER_API_URL+url, data, { headers: { Authorization: "Bearer " + jwtToken}});
        //console.log(responseData);
        return response.data;
        
    } catch (error: any) {
        //return error;    
        return (error.response.data.message);
    }
}

export const patchDataWithJWT = async(url: string, data: any, jwtToken: string) => {
    
    //console.log(API_URL);
    try {
        const response = await axios.patch(SERVER_API_URL+url, data, { headers: { Authorization: "Bearer " + jwtToken}});
        //console.log(responseData);
        return response.data;
        
    } catch (error: any) {
        //return error;    
        return (error.response.data.message);
    }
}

export const getDatasFromAxios = async(url: string, jwtToken: string) => {
    console.log(jwtToken);
    //console.log(API_URL);
    try {
        const response = await axios.get(SERVER_API_URL+url, {
            headers:{
                Authorization: "Bearer " +  jwtToken,
            }
        });
        //console.log(responseData);
        return response.data;
        
    } catch (error: any) {
        //return error;    
        //console.log(error);
        return (error.response.data.message);
    }
}
export const deleteDataFromAxios = async(url: string, jwtToken: string) => {
    try {
        const response = await axios.delete(SERVER_API_URL+url, {
            headers:{
                Authorization: "Bearer " +  jwtToken,
            }
        });
        
        return response.data;
        
    } catch (error: any) {
        //return error;    
        //console.log(error);
        return (error.response.data);
    }
}
