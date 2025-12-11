import axios from 'axios';

const client = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:9090',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터
client.interceptors.request.use(
  (config) => {
    // 토큰 있으면 헤더에 추가
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`🚀 [${config.method?.toUpperCase()}] ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터
client.interceptors.response.use(
  (response) => {
    console.log(`✅ [${response.status}] ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error(`❌ [${error.response?.status}] ${error.config?.url}`);
    
    // 에러 처리
    if (error.response?.status === 401) {
      // 인증 만료 처리
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// 공통 API 함수
export const apiRequest = async (method, url, data = null, config = {}) => {
  try {
    const response = await client({
      method,
      url,
      data,
      ...config,
    });
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || '요청에 실패했습니다.',
      status: error.response?.status,
    };
  }
};

export default client;