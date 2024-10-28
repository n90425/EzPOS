import axiosInstance from "./axiosInstance";


// GET 요청
export const getMappingData = async () => {
    try {
        // http://localhost:8080/api/endpoint 로 요청이 들어감
        const res = await axiosInstance.get('/api/endpoint');

        // back의 get매핑된 data를 가져온다
        return res.data;
    } catch(error){
        console.error('GET API 호출 에러:', error);
        throw error;
    }
};

// POST 요청
export const postMappingData = async (data) => {
    try {
        // http://localhost:8080/api/post-endpoint 로 요청, post body는 null, params는 맵형식 
        const req = await axiosInstance.post('/api/post-endpoint', null, {params: data});
        return req.data;
    } catch (error){
        console.error('POST API 호출 에러:', error);
        throw error;
    }
};

// get과 post 함수는 ApiComponent.js 에서 호출됨