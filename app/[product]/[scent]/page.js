"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

/**
 * scent 상세 페이지 (예: /shampoo/fruity)
 * - 선택한 scent에 속한 fragrance 목록을 표시
 * - 홈 / 제품으로 돌아가기 버튼 제공
 */
export default function ScentPage() {
  const { product, scent } = useParams(); // URL 파라미터 추출
  const [fragranceGroup, setFragranceGroup] = useState(null); // scent 그룹 정보

  // 백엔드에서 전체 데이터를 받아와서 현재 scent 그룹만 찾음
  useEffect(() => {
    fetch("http://localhost:8000/fragrances")
      .then((res) => res.json())
      .then((data) => {
        const found = data.find(
          (item) => item.product === product && item.scent_slug === scent
        );
        setFragranceGroup(found);
      })
      .catch((err) => console.error("API error:", err));
  }, [product, scent]);

  if (!fragranceGroup) return <div className="p-8">로딩 중...</div>;

  return (
    <div className="p-8">
      {/* 상단 이동 버튼: 홈, 제품 페이지 */}
      <div className="mb-4 flex gap-4">
        <Link href="/" className="text-blue-500 underline">← 홈</Link>
        <Link href={`/${product}`} className="text-blue-500 underline">← {product}</Link>
      </div>

      {/* scent 이름 표시 */}
      <h1 className="text-3xl font-bold mb-4">
        {fragranceGroup.scent} ({product})
      </h1>

      {/* fragrance 리스트 표시 */}
      <div className="grid grid-cols-2 gap-4">
        {fragranceGroup.fragrances.map((frag, i) => (
          <Link
            key={i}
            href={`/${product}/${scent}/${frag.slug}`}
          >
            <div className="border p-4 rounded shadow hover:bg-gray-100 cursor-pointer">
              {frag.name}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
