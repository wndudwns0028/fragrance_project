"use client"; // 클라이언트 컴포넌트 선언 (useEffect 사용 가능)

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // URL 파라미터 추출
import Link from "next/link"; // 페이지 이동을 위한 컴포넌트

/**
 * 이 페이지는 세부 향기(fragrance) 하나의 정보를 보여주는 상세 페이지입니다.
 * 예: /shampoo/fruity/peach
 * 
 * - URL로부터 제품명, scent, fragrance를 추출
 * - 해당 정보와 일치하는 데이터를 백엔드에서 불러옴
 * - 상단에는 홈, 제품, scent 페이지로 돌아갈 수 있는 버튼 제공
 */
export default function FragranceDetailPage() {
  // 🔸 URL에서 product, scent, fragrance 추출
  const { product, scent, fragrance } = useParams();

  // 🔸 fragrance 관련 정보를 저장하는 상태
  const [fragranceInfo, setFragranceInfo] = useState(null);

  // 🔸 컴포넌트가 마운트될 때 백엔드에서 전체 데이터를 불러와 필터링
  useEffect(() => {
    fetch("http://localhost:8000/fragrances") // 전체 fragrance 문서 요청
      .then((res) => res.json())
      .then((data) => {
        // 현재 제품 + scent와 일치하는 문서를 찾음
        const scentGroup = data.find(
          (item) => item.product === product && item.scent_slug === scent
        );
        if (!scentGroup) return; // 없으면 중단

        // 해당 scentGroup 내에서 fragrance slug가 일치하는 향기를 찾음
        const target = scentGroup.fragrances.find((f) => f.slug === fragrance);

        // 찾은 정보를 상태에 저장 (상위 정보 포함)
        setFragranceInfo({
          product: scentGroup.product,
          scent: scentGroup.scent,
          scent_slug: scentGroup.scent_slug,
          fragrance: target,
        });
      })
      .catch((err) => console.error("API error:", err)); // API 오류 처리
  }, [product, scent, fragrance]);

  // 아직 데이터가 준비되지 않은 경우 로딩 메시지 출력
  if (!fragranceInfo)
    return <div className="p-8">향기 정보를 불러오는 중입니다...</div>;

  return (
    <div className="p-8">
      {/* 🔹 상단 내비게이션: 홈 > 제품 > scent 로 돌아가는 링크 */}
      <div className="mb-4 flex gap-4">
        <Link href="/" className="text-blue-500 underline">← 홈</Link>
        <Link href={`/${product}`} className="text-blue-500 underline">← {product}</Link>
        <Link href={`/${product}/${scent}`} className="text-blue-500 underline">← {fragranceInfo.scent}</Link>
      </div>

      {/* 🔹 제목 및 향기 이름 출력 */}
      <h1 className="text-2xl font-bold mb-2">
        {fragranceInfo.product} - {fragranceInfo.scent}
      </h1>
      <h2 className="text-xl font-semibold mb-4">
        세부 향기: {fragranceInfo.fragrance.name}
      </h2>

      {/* 🔹 실제 제품 데이터가 있으면 이 부분에 렌더링 가능 */}
      <p>이 향기를 가진 제품이 여기에 나올 예정입니다.</p>
    </div>
  );
}
