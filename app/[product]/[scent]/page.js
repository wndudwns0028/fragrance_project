"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

// 해당 scent에 속하는 세부 향기들을 보여주고, 네이버 쇼핑 API 결과를 함께 출력하는 페이지
export default function ScentPage() {
  // URL에서 product(shampoo 등), scent(fruity 등)를 추출
  const { product, scent } = useParams();

  // 상태: 백엔드에서 가져온 scent 데이터
  const [scentData, setScentData] = useState(null);
  // 상태: 네이버 쇼핑 API 결과
  const [shoppingResults, setShoppingResults] = useState([]);

  // 컴포넌트 마운트 시 실행
  useEffect(() => {
    // 1. scent 상세 정보 불러오기
    fetch("http://localhost:8000/fragrances")
      .then((res) => res.json())
      .then((data) => {
        const target = data.find(
          (item) => item.product === product && item.scent_slug === scent
        );
        setScentData(target);
      })
      .catch((err) => console.error("Fragrance API fetch error:", err));

    // 2. 네이버 쇼핑 검색 결과 불러오기 (예: "shampoo 과일향")
    fetch(
      `http://localhost:8000/naver/search?query=${encodeURIComponent(
        product + " " + scent
      )}`
    )
      .then((res) => res.json())
      .then((data) => setShoppingResults(data.items || []))
      .catch((err) => console.error("Naver API fetch error:", err));
  }, [product, scent]);

  // scent 데이터가 아직 도착하지 않았을 경우 로딩 문구 출력
  if (!scentData) {
    return <div className="p-8">데이터를 불러오는 중입니다...</div>;
  }

  return (
    <div className="p-8">
      {/* 상단 네비게이션: 홈 > 제품 > 대분류 향 */}
      <div className="mb-4 flex gap-4">
        <Link href="/" className="text-blue-500 underline">← 홈</Link>
        <Link href={`/${product}`} className="text-blue-500 underline">← {product}</Link>
      </div>

      {/* 대분류 향 제목 */}
      <h1 className="text-2xl font-bold mb-2">
        {product} - {scentData.scent}
      </h1>

      {/* 세부 향기 목록 (버튼들) */}
      <div className="mb-6 flex flex-wrap gap-2">
        {scentData.fragrances.map((frag, i) => (
          <Link
            key={i}
            href={`/${product}/${scent}/${frag.slug}`} // 예: /shampoo/fruity/peach
          >
            <div className="border rounded-full px-4 py-1 bg-white hover:bg-blue-100 cursor-pointer shadow-sm text-sm">
              {frag.name}
            </div>
          </Link>
        ))}
      </div>

      {/* 네이버 쇼핑 결과 출력 */}
      <h2 className="text-lg font-semibold mb-2">
        {product} - {scent} 관련 상품
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {shoppingResults.map((item, index) => (
          <div
            key={index}
            className="border p-3 rounded shadow-sm bg-white"
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-48 object-contain mb-2"
            />
            <div
              className="font-medium text-sm mb-1"
              dangerouslySetInnerHTML={{ __html: item.title }}
            />
            <p className="text-blue-700 font-bold mb-1">{item.lprice}원</p>
            <a
              href={item.link}
              target="_blank"
              className="text-green-600 underline text-sm"
            >
              네이버에서 보기
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
