"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

/**
 * 제품 메인 페이지 (/shampoo 등)
 * - 향기 카테고리 + 전체 관련 상품을 함께 보여주는 페이지
 */
export default function ProductPage() {
  const { product } = useParams();

  const [scents, setScents] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/fragrances`)
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter((item) => item.product === product);
        setScents(filtered);

        // fragrance 이름들만 전부 추출해서 API 요청
        const allFrags = filtered.flatMap((item) =>
          item.fragrances.map((f) => f.name)
        );

        // 각 fragrance 이름으로 네이버 API 요청
        allFrags.forEach((frag) => {
          const query = `${product} ${frag}`;
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/naver/search?query=${encodeURIComponent(query)}`)
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

  return (
    <div className="min-h-screen bg-white p-8">
      {/* 홈으로 이동 */}
      <Link href="/" className="text-blue-500 underline mb-4 block">
        ← 홈으로
      </Link>

      {/* 제품명 출력 */}
      <h1 className="text-4xl font-bold text-center mb-8 capitalize">
        {product}
      </h1>

      {/* scent + fragrance 목록 */}
      <div className="flex flex-wrap gap-6 justify-center mb-12">
        {scents.map((item, index) => (
          <div key={index} className="bg-gray-100 p-4 rounded-lg shadow w-72">
            {/* scent 이름 - scent 상세 페이지로 이동 */}
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

      {/* 전체 관련 상품 출력 */}
      <h2 className="text-2xl font-bold mb-4">전체 관련 상품</h2>
      {products.length === 0 ? (
        <p className="text-gray-500">관련 상품이 없습니다.</p>
      ) : (
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
      )}
    </div>
  );
}
