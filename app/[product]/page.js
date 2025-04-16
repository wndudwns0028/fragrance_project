"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

/**
 * 제품 페이지 (예: /shampoo)
 * - 특정 제품의 scent 및 fragrance 목록을 보여줌
 * - 상단에 '홈으로' 버튼 제공
 */
export default function ProductPage() {
  const { product } = useParams(); // 현재 URL에서 제품 이름 가져오기

  const [scents, setScents] = useState([]); // 해당 제품에 대한 scent+fragrance 정보

  // 컴포넌트 로드 시 백엔드에서 모든 fragrance 정보 불러오고 필터링
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/fragrances`)
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter((item) => item.product === product);
        setScents(filtered); // 해당 제품만 추출해서 상태로 저장
      })
      .catch((err) => console.error("Error fetching fragrances:", err));
  }, [product]);

  return (
    <div className="min-h-screen bg-white p-8">
      {/* 🔙 홈으로 이동 */}
      <Link href="/" className="text-blue-500 underline mb-4 block">
        ← 홈으로
      </Link>

      {/* 제품명 표시 */}
      <h1 className="text-4xl font-bold text-center mb-8 capitalize">
        {product}
      </h1>

      {/* scent + fragrance 출력 */}
      <div className="flex flex-wrap gap-4 justify-center">
        {scents.map((item, index) => (
          <div key={index} className="bg-gray-100 p-4 rounded-lg shadow w-64">
            {/* scent 이름 - 클릭 시 scent 상세 페이지로 이동 */}
            <Link href={`/${product}/${item.scent_slug}`}>
              <h2 className="text-xl font-semibold mb-2 hover:underline cursor-pointer">
                {item.scent}
              </h2>
            </Link>

            {/* fragrance 리스트 */}
            <div className="flex flex-wrap gap-2">
              {item.fragrances.map((f, i) => (
                <Link
                  key={i}
                  href={`/${product}/${item.scent_slug}/${f.slug}`}
                >
                  <div className="bg-white px-3 py-1 rounded-full border text-sm shadow-sm cursor-pointer hover:bg-blue-100">
                    {f.name}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
