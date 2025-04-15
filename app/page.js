"use client"; // Next.js의 client component로 설정 (브라우저에서 동작)

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion"; // 애니메이션 라이브러리
import Link from "next/link"; // 페이지 이동을 위한 컴포넌트

export default function HomePage() {
  // 🔸 백엔드에서 받아온 전체 fragrance 데이터 저장
  const [allData, setAllData] = useState([]);

  // 🔸 현재 마우스를 올린 제품 이름 (예: "shampoo")
  const [hoveredProduct, setHoveredProduct] = useState(null);

  // 🔸 현재 마우스를 올린 scent 이름 (예: "과일향")
  const [hoveredScent, setHoveredScent] = useState(null);

  // 🔸 컴포넌트가 처음 로드될 때 실행되는 API 호출
  useEffect(() => {
    fetch("http://localhost:8000/fragrances") // FastAPI 백엔드에서 전체 데이터 가져오기
      .then((res) => res.json())
      .then((data) => setAllData(data)) // 상태로 저장
      .catch((err) => console.error("API fetch error:", err)); // 오류 출력
  }, []);

  // 🔸 전체 데이터에서 고유한 제품 이름 목록 추출 (중복 제거)
  const productList = [...new Set(allData.map((item) => item.product))];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      {/* 페이지 상단 제목 */}
      <h1 className="text-3xl font-bold mb-6">향기 기반 화장품 추천</h1>

      {/* 제품 리스트 출력 영역 */}
      <div className="flex gap-4">
        {productList.map((product) => (
          <div
            key={product}
            className="relative"
            // 마우스를 올리면 해당 제품을 hover 상태로 설정
            onMouseEnter={() => setHoveredProduct(product)}
            // 마우스를 벗어났을 때 하위 드롭박스까지 벗어난 경우 hover 해제
            onMouseLeave={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget)) {
                setHoveredProduct(null);
                setHoveredScent(null);
              }
            }}
          >
            {/* 🔹 제품 버튼 (예: shampoo, bodywash 등) - 클릭 시 해당 제품 페이지로 이동 */}
            <Link href={`/${product}`}>
              <div className="px-4 py-2 bg-white rounded shadow text-lg text-center cursor-pointer hover:bg-gray-200">
                {product}
              </div>
            </Link>

            {/* 🔹 scent 드롭다운 메뉴 (제품에 마우스를 올렸을 때만 표시) */}
            {hoveredProduct === product && (
              <motion.div
                className="absolute top-full left-1/2 -translate-x-1/2 bg-white shadow-lg rounded-lg p-3 z-20 w-48"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {/* 현재 제품에 속한 scent들만 필터링해서 출력 */}
                {allData
                  .filter((item) => item.product === product)
                  .map((item, idx) => (
                    <div
                      key={idx}
                      className="relative px-3 py-1 text-gray-800 hover:bg-gray-100 rounded cursor-pointer"
                      onMouseEnter={() => setHoveredScent(item.scent)}
                      onMouseLeave={(e) => {
                        if (!e.currentTarget.contains(e.relatedTarget)) {
                          setHoveredScent(null);
                        }
                      }}
                    >
                      {/* scent 이름 출력 및 해당 scent 페이지로 이동 */}
                      <Link href={`/${product}/${item.scent_slug}`}>
                        <div className="hover:underline">{item.scent}</div>
                      </Link>

                      {/* 🔹 fragrance 드롭다운 (scent에 마우스를 올렸을 때만 표시) */}
                      {hoveredScent === item.scent && (
                        <motion.div
                          className="absolute top-0 left-full ml-2 bg-white shadow-lg rounded-lg p-3 w-48 z-30"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          {/* 해당 scent에 속한 fragrance들 출력 */}
                          {item.fragrances.map((frag, i) => (
                            <Link
                              key={i}
                              href={`/${product}/${item.scent_slug}/${frag.slug}`}
                            >
                              <div className="px-3 py-1 text-gray-700 hover:bg-gray-200 rounded">
                                {frag.name}
                              </div>
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </div>
                  ))}
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
