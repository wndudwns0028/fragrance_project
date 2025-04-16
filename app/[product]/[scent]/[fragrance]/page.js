"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function FragranceDetailPage() {
  // 현재 URL에서 동적 파라미터 추출 (예: shampoo / fruity / peach)
  const { product, scent, fragrance } = useParams();

  // 전체 scent 데이터에서 이 fragrance가 속한 scent 그룹을 찾기 위한 상태
  const [scentGroup, setScentGroup] = useState(null);

  // 네이버 API에서 검색된 제품 리스트
  const [products, setProducts] = useState([]);

  // 1. 전체 scent 데이터 중에서 해당 fragrance 정보를 가져옴
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/fragrances`)
      .then((res) => res.json())
      .then((data) => {
        // product와 scent_slug로 해당 scent 그룹 찾기
        const found = data.find(
          (item) => item.product === product && item.scent_slug === scent
        );
        if (!found) return;
        setScentGroup(found);

        // fragrance 이름으로 네이버 API 검색 요청
        const targetFragrance = found.fragrances.find(
          (f) => f.slug === fragrance
        );
        if (targetFragrance) {
          fetch(
            `http://localhost:8000/naver/search?query=${product} ${targetFragrance.name}`
          )
            .then((res) => res.json())
            .then((res) => setProducts(res.items || []))
            .catch((err) => console.error("네이버 API 에러:", err));
        }
      })
      .catch((err) => console.error("Fragrance fetch error:", err));
  }, [product, scent, fragrance]);

  if (!scentGroup)
    return <div className="p-6">데이터를 불러오는 중입니다...</div>;

  return (
    <div className="p-8">
      {/* 🔙 상위 경로로 돌아가기 링크들 */}
      <div className="mb-4 flex gap-4 text-sm">
        <Link href="/" className="text-blue-500 underline">
          ← 홈
        </Link>
        <Link href={`/${product}`} className="text-blue-500 underline">
          ← {product}
        </Link>
        <Link href={`/${product}/${scent}`} className="text-blue-500 underline">
          ← {scentGroup.scent}
        </Link>
      </div>

      {/* 🔠 타이틀 정보 */}
      <h1 className="text-2xl font-bold mb-1">
        {product} - {scentGroup.scent}
      </h1>
      <h2 className="text-xl font-semibold mb-4">
        세부 향기: {scentGroup.fragrances.find(f => f.slug === fragrance)?.name}
      </h2>

      {/* 🔄 같은 scent 내 다른 세부향으로 이동할 수 있는 버튼들 */}
      <div className="flex gap-2 flex-wrap mb-6">
        {scentGroup.fragrances.map((f, i) => (
          <Link
            key={i}
            href={`/${product}/${scent}/${f.slug}`}
            className={`px-4 py-2 rounded-full border text-sm cursor-pointer hover:bg-blue-100 ${
              f.slug === fragrance ? "bg-blue-200 font-semibold" : ""
            }`}
          >
            {f.name}
          </Link>
        ))}
      </div>

      {/* 📦 네이버 쇼핑 검색 결과 출력 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((item, idx) => (
          <div
            key={idx}
            className="border rounded-lg shadow p-4 bg-white flex flex-col"
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-48 object-contain mb-2"
            />
            <h3
              className="font-semibold text-sm mb-1"
              dangerouslySetInnerHTML={{ __html: item.title }}
            />
            <p className="text-blue-600 text-sm mb-2">{item.lprice}원</p>
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
