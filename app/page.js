"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

// scent: 향기 카테고리 이름 (예: 플로럴 향)
// fragrances: 해당 카테고리에 포함된 개별 향기들 (예: 로즈, 라벤더 등)

export default function HomePage() {
  // 마우스를 올린 scent(향기 그룹) 이름을 저장
  const [hoveredScent, setHoveredScent] = useState(null);

  // 백엔드에서 받아온 scent 카테고리 배열
  const [scentCategories, setScentCategories] = useState([]);

  // 페이지 로딩 시 FastAPI 백엔드에서 향기 카테고리 데이터 가져오기
  useEffect(() => {
    fetch("http://localhost:8000/fragrances") // FastAPI 서버에서 scent 목록을 가져옴
      .then((res) => res.json()) // JSON 형식으로 응답 변환
      .then((data) => setScentCategories(data)) // 받아온 데이터를 상태에 저장
      .catch((err) => console.error("API fetch error:", err)); // 오류 발생 시 로그 출력
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-4">
      {/* 페이지 타이틀 + 애니메이션 */}
      <motion.h1 
        className="text-4xl font-bold mb-6 text-center"
        initial={{ opacity: 0, y: -20 }} // 초기 상태 (살짝 위에 있음)
        animate={{ opacity: 1, y: 0 }}   // 등장 애니메이션
        transition={{ duration: 0.5 }}   // 애니메이션 지속 시간
      >
        향기 기반 화장품 추천
      </motion.h1>

      {/* 검색창 영역 */}
      <div className="w-full max-w-lg">
        <Input 
          type="text" 
          placeholder="원하는 향을 검색해보세요..." 
          className="mb-4" 
        />
        <Button className="w-full">
          검색
        </Button>
      </div>

      {/* 향기 카테고리 네비게이션 (상단 메뉴) */}
      <nav className="mt-8 w-full max-w-3xl bg-white p-4 shadow-md rounded-lg flex justify-around">
        {scentCategories.map((category, index) => (
          <div 
            key={index} 
            className="relative"
            onMouseEnter={() => setHoveredScent(category.scent)} // 마우스 올리면 상태 변경
            onMouseLeave={(e) => {
              // 자식 요소로 마우스가 이동한 경우 상태 유지
              if (!e.currentTarget.contains(e.relatedTarget)) {
                setHoveredScent(null); // 아니면 초기화
              }
            }}
          >
            {/* scent 이름 (큰 그룹) */}
            <button className="text-lg font-semibold px-4 py-2 hover:text-blue-500">
              {category.scent}
            </button>

            {/* fragrance 리스트 (드롭다운) */}
            {hoveredScent === category.scent && (
              <motion.div 
                className="absolute left-0 top-full mt-2 bg-white shadow-lg rounded-lg p-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                onMouseEnter={() => setHoveredScent(category.scent)} // 드롭다운 위에 마우스 있으면 유지
                onMouseLeave={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget)) {
                    setHoveredScent(null);
                  }
                }}
              >
                {/* 개별 fragrance 항목들 */}
                {category.fragrances.map((fragrance, i) => (
                  <div 
                    key={i}
                    className="px-4 py-2 text-gray-700 hover:bg-gray-200 cursor-pointer rounded"
                  >
                    {fragrance}
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
