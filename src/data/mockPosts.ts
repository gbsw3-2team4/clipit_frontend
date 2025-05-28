// src/data/mockPosts.ts
export const mockPosts = [
  {
    id: "1",
    username: "Alice",
    createdAt: "2시간 전",
    title: "React 상태관리 기초",
    description: "useState와 useEffect를 이용한 기초적인 상태관리 예제입니다.",
    code: `import { useState, useEffect } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log("count changed:", count);
  }, [count]);

  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}`,
    tags: ["React", "useState", "useEffect"],
  },
  {
    id: "2",
    username: "Bob",
    createdAt: "4시간 전",
    title: "axios 인스턴스 설정하기",
    description:
      "baseURL과 인터셉터 설정을 통해 axios 요청을 통일감 있게 관리해보세요.",
    code: `import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://api.example.com',
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  config.headers.Authorization = \`Bearer \${localStorage.getItem('token')}\`;
  return config;
});

export default axiosInstance;`,
    tags: ["Axios", "API", "Interceptor"],
  },
  {
    id: "3",
    username: "Clara",
    createdAt: "어제",
    title: "JavaScript 배열 정렬하기",
    description: "sort 메서드를 활용한 숫자 및 문자열 배열 정렬 팁.",
    code: `const numbers = [10, 2, 5, 1, 9];
numbers.sort((a, b) => a - b); // 오름차순
console.log(numbers);`,
    tags: ["JavaScript", "배열", "정렬"],
  },
  {
    id: "4",
    username: "David",
    createdAt: "3일 전",
    title: "styled-components에서 전역 스타일 적용하기",
    description: "createGlobalStyle을 이용한 Pretendard 폰트 설정 예시입니다.",
    code: `import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle\`
  @font-face {
    font-family: 'Pretendard';
    src: url('/fonts/Pretendard-Regular.woff2') format('woff2');
  }

  body {
    font-family: 'Pretendard', sans-serif;
  }
\`;

export default GlobalStyle;`,
    tags: ["styled-components", "CSS", "GlobalStyle"],
  },
  {
    id: "5",
    username: "Eve",
    createdAt: "1주일 전",
    title: "TypeScript 유틸리티 타입 정리",
    description: "Pick, Partial, Record 등의 유틸리티 타입 사용 예시입니다.",
    code: `interface User {
  id: number;
  name: string;
  email: string;
}

type UserPreview = Pick<User, "id" | "name">;
type PartialUser = Partial<User>;
type UserRecord = Record<string, User>;`,
    tags: ["TypeScript", "유틸리티 타입"],
  },
];
