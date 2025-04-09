"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

export default function HomePage() {
  // 마우스 호버된 카테고리 상태
  const [hoveredCategory, setHoveredCategory] = useState(null);
  // API에서 가져온 향기 카테고리 데이터를 저장하는 상태
  const [scentCategories, setScentCategories] = useState([]);

  // 컴포넌트가 처음 렌더링될 때 한 번만 백엔드 API 호출
  useEffect(() => {
    fetch("http://localhost:8000/fragrances") // FastAPI 서버의 향기 목록 엔드포인트
      .then((res) => res.json()) // JSON 형식으로 응답 파싱
      .then((data) => setScentCategories(data)) // 받아온 데이터를 상태로 저장
      .catch((err) => console.error("API fetch error:", err)); // 오류 출력
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-4">
      {/* 타이틀 애니메이션 */}
      <motion.h1 
        className="text-4xl font-bold mb-6 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        향기 기반 화장품 추천
      </motion.h1>

      {/* 검색창 */}
      <div className="w-full max-w-lg">
        <Input type="text" placeholder="원하는 향을 검색해보세요..." className="mb-4" />
        <Button className="w-full">검색</Button>
      </div>

      {/* 향기 카테고리 네비게이션 */}
      <nav className="mt-8 w-full max-w-3xl bg-white p-4 shadow-md rounded-lg flex justify-around">
        {scentCategories.map((category, index) => (
          <div 
            key={index} 
            className="relative"
            onMouseEnter={() => setHoveredCategory(category.category)} // 마우스가 올라갔을 때 상태 업데이트
            onMouseLeave={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget)) {
                setHoveredCategory(null); // 마우스가 벗어났을 때 상태 초기화
              }
            }}
          >
            <button className="text-lg font-semibold px-4 py-2 hover:text-blue-500">
              {category.category}
            </button>

            {/* 하위 향기 리스트 보여주는 드롭다운 */}
            {hoveredCategory === category.category && (
              <motion.div 
                className="absolute left-0 top-full mt-2 bg-white shadow-lg rounded-lg p-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                onMouseEnter={() => setHoveredCategory(category.category)}
                onMouseLeave={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget)) {
                    setHoveredCategory(null);
                  }
                }}
              >
                {/* 향기 리스트 렌더링 */}
                {category.fragrances.map((scent, scentIndex) => (
                  <div 
                    key={scentIndex} 
                    className="px-4 py-2 text-gray-700 hover:bg-gray-200 cursor-pointer rounded"
                  >
                    {scent}
                  </div>
                ))}
              </motion.div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
}
