"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ShampooPage() {
  // 향 카테고리 목록을 담을 상태 변수
  const [scentCategories, setScentCategories] = useState([]);

  // 페이지 로딩 시 FastAPI 백엔드에서 향 카테고리 가져오기
  useEffect(() => {
    fetch("http://localhost:8000/fragrances")  // 향 카테고리 목록 API 호출
      .then((res) => res.json())               // JSON 형식으로 변환
      .then((data) => setScentCategories(data))// 상태에 저장
      .catch((err) => console.error("API fetch error:", err)); // 에러 로그 출력
  }, []);

  return (
    <div className="p-6">
      {/* 페이지 타이틀 */}
      <motion.h1 
        className="text-3xl font-bold mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        샴푸 카테고리 - 향기 목록
      </motion.h1>

      {/* 향기 카테고리 리스트 */}
      <div className="grid grid-cols-2 gap-4">
        {scentCategories.map((category, index) => (
          // 각 향 카테고리로 이동하는 버튼 생성
          <Link
            key={index}
            href={`/products/${category.scent}`} // 클릭 시 해당 향 상세 페이지로 이동
            className="block p-4 bg-gray-100 rounded shadow hover:bg-gray-200 text-center"
          >
            {category.scent}
          </Link>
        ))}
      </div>
    </div>
  );
}
