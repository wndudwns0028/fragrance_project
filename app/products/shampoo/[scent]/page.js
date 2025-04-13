"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // Next.js 라우터 훅
import { motion } from "framer-motion";

export default function ScentDetailPage() {
  const params = useParams(); // URL의 [scent] 값을 가져옴
  const scent = params.scent; // 해당 값 추출
  const [fragranceData, setFragranceData] = useState(null);

  // 페이지 로딩 시 해당 scent 데이터 불러오기
  useEffect(() => {
    fetch(`http://localhost:8000/fragrances/${scent}`)
      .then((res) => res.json())
      .then((data) => setFragranceData(data))
      .catch((err) => console.error("API fetch error:", err));
  }, [scent]);

  if (!fragranceData) {
    return <div>데이터 불러오는 중...</div>;
  }

  return (
    <div className="p-6">
      {/* 상단 타이틀 */}
      <motion.h1 
        className="text-3xl font-bold mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {fragranceData.scent} 향기 카테고리
      </motion.h1>

      {/* fragrance 리스트 출력 */}
      <div className="space-y-2">
        {fragranceData.fragrances.map((item, i) => (
          <div 
            key={i}
            className="p-3 bg-gray-100 rounded shadow-sm"
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
