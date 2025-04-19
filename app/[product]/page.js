"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

/**
 * 제품 메인 페이지 (예: /shampoo)
 * - 향기 카테고리 + 네이버 상품 리스트 표시
 * - 가격 정렬 버튼 제공 (오름차순 / 내림차순)
 */
export default function ProductPage() {
  const { product } = useParams(); // URL에서 제품명 가져오기 (예: shampoo)

  const [scents, setScents] = useState([]); // 해당 제품에 대한 scent+fragrance 정보
  const [products, setProducts] = useState([]); // 네이버 API 상품 목록
  const [sortOrder, setSortOrder] = useState("asc"); // 가격 정렬 순서 (asc or desc)

  // 데이터 불러오기: scent 목록 + 네이버 API 상품
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/fragrances`)
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter((item) => item.product === product);
        setScents(filtered);

        const allFrags = filtered.flatMap((item) =>
          item.fragrances.map((f) => f.name)
        );

        // fragrance 이름 기준으로 상품 검색
        allFrags.forEach((frag) => {
          const query = `${product} ${frag}`;
          fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/naver/search?query=${encodeURIComponent(
              query
            )}`
          )
            .then((res) => res.json())
            .then((res) => {
              if (res.items) {
                setProducts((prev) => [...prev, ...res.items]);
              }
            })
            .catch((err) => console.error("네이버 검색 실패:", err));
        });
      })
      .catch((err) => console.error("fragrance 데이터 오류:", err));
  }, [product]);

  // 가격 정렬된 리스트 반환
  const sortedProducts = [...products].sort((a, b) => {
    const priceA = parseInt(a.lprice, 10);
    const priceB = parseInt(b.lprice, 10);
    return sortOrder === "asc" ? priceA - priceB : priceB - priceA;
  });

  // 정렬 방식 토글 함수
  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  return (
    <div className="min-h-screen bg-white p-8">
      {/* 🔙 홈으로 돌아가기 */}
      <Link href="/" className="text-blue-500 underline mb-4 block">
        ← 홈으로
      </Link>

      {/* 🔠 제품 이름 */}
      <h1 className="text-4xl font-bold text-center mb-4 capitalize">
        {product}
      </h1>

      {/* 🔘 정렬 토글 버튼 */}
      <div className="flex justify-center mb-6">
        <button
          onClick={toggleSortOrder}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          가격 {sortOrder === "asc" ? "▲ 오름차순" : "▼ 내림차순"}
        </button>
      </div>

      {/* 향기 목록 (대분류 + 세부 향기) */}
      <div className="flex flex-wrap gap-6 justify-center mb-12">
        {scents.map((item, index) => (
          <div key={index} className="bg-gray-100 p-4 rounded-lg shadow w-72">
            <Link href={`/${product}/${item.scent_slug}`}>
              <h2 className="text-xl font-semibold mb-2 hover:underline cursor-pointer">
                {item.scent}
              </h2>
            </Link>
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

      {/* 🛍 전체 상품 목록 */}
      <h2 className="text-2xl font-bold mb-4">전체 관련 상품</h2>
      {sortedProducts.length === 0 ? (
        <p className="text-gray-500">관련 상품이 없습니다.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedProducts.map((item, idx) => (
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
      )}
    </div>
  );
}
