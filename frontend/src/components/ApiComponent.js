import React, { useEffect, useState } from "react";
import { getMappingData , postMappingData } from "../api/apiService";

const Component = () => {

    // GET 요청
    // data: server에서 가져온 데이터가 저장되있음
    const [data, setData] = useState(null);

    // 컴포넌트가 처음 렌더링될 때 
    useEffect(()=> {
        // 선언: getData 함수를 실행하여 데이터를 가져온다
        const getData = async() => {
            try {
                // apiService.js의 get요청 함수호출
                const result = await getMappingData();
                // 데이터를 가져오면 setData 함수를 사용해 상태를 저장한다
                setData(result);
            } catch(error){
                // TODO: error 처리
                console.error('데이터 가져오기 실패:', error);
            }
        };

        // 호출
        getData();
    }, []);


    // POST 요청
    // inputData: 사용자가 입력한 데이터를 저장
    const [inputData, setInputData] = useState('');
    
    // 사용자가 입력한 데이터를 post 함수를 호출하여 서버로 전송
    const handlePostData = async () => {
        try {
            const response = await postMappingData({data: inputData});
            console.log('POST 요청성공', response);
        } catch(error){
            console.log('POST 요청 실패:', error);
        }
    };

    return (
        <div>
            <h1>GET 요청 TEST</h1>
            {data ? <pre>{JSON.stringify(data, null, 2)}</pre> : '로딩중...'}



            <h2>POST 요청 테스트</h2>
            <input 
                type="text"
                value={inputData}
                onChange={(e) => setInputData(e.target.value)}
                placeholder="데이터 입력"
            />
            <button onClick={handlePostData}>데이터전송</button>
        </div>
    );
};

export default Component;