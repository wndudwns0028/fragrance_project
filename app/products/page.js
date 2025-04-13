"use client";

import React from "react";
import Link from "next/link";  // 페이지 이동을 위한 Link 컴포넌트
import { motion } from "framer-motion";

export default function ProductsPage() {
  // 제품 카테고리 목록 배열
  const categories = ["shampoo", "bodywash", "handcream", "perfume"];

  return (
    <div className="p-6">
      {/* 페이지 타이틀 */}
      <motion.h1 
        className="text-3xl font-bold mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        제품 카테고리
      </motion.h1>

      {/* 카테고리 리스트 */}
      <div className="grid grid-cols-2 gap-4">
        {categories.map((item, index) => (
          // 제품 카테고리마다 페이지 이동 버튼 생성
          <Link
            key={index}
            href={`/products/${item}`} // 해당 카테고리 페이지로 이동
            className="block p-4 bg-gray-100 rounded shadow hover:bg-gray-200 text-center text-lg"
          >
            {item}
          </Link>
        ))}
      </div>
    </div>
  );
}
