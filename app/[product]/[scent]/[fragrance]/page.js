"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

/**
 * 세부 향기 상세 페이지
 * - 해당 fragrance에 대해 네이버 쇼핑에서 검색한 상품들을 보여줌
 * - 같은 scent의 다른 fragrance로 이동할 수 있는 버튼도 제공
 */
export default function FragranceDetailPage() {
  const { product, scent, fragrance } = useParams(); // URL 파라미터 추출
  const [scentGroup, setScentGroup] = useState(null); // 해당 scent 정보 (대분류 향기)
  const [products, setProducts] = useState([]); // 네이버 API에서 가져온 제품 리스트

  useEffect(() => {
    // 1. 전체 향기 리스트 가져오기
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/fragrances`)
      .then((res) => res.json())
      .then((data) => {
        const found = data.find(
          (item) => item.product === product && item.scent_slug === scent
        );
        if (!found) return;
        setScentGroup(found);

        // 2. fragrance 객체 추출
        const targetFragrance = found.fragrances.find(f => f.slug === fragrance);

        // 2️⃣ fragrance.name 누락 여부 콘솔로 확인
        console.log("🎯 targetFragrance:", targetFragrance);
        if (!targetFragrance || !targetFragrance.name) {
          console.warn("⛔ fragrance 이름 누락!");
          return;
        }

        // 3. "향" 제거하고 검색어 생성
        const cleanedName = targetFragrance.name.replace(/향$/, ""); // "향"으로 끝나는 경우만 제거
        const query = encodeURIComponent(`"${cleanedName} ${product}"`);

        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/naver/search?query=${query}`;
        console.log("🔗 요청 URL:", apiUrl);  // 디버깅 로그
      
        fetch(apiUrl)
          .then((res) => res.json())
          .then((res) => {
            console.log("🛒 네이버 API 응답:", res);  // 응답 확인
            setProducts(res.items || []);
          })
          .catch((err) => console.error("네이버 API 에러:", err));

        // 4. 네이버 쇼핑 API 호출
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/naver/search?query=${query}`)
          .then((res) => res.json())
          .then((res) => {
            console.log("🛒 네이버 API 응답 전체:", res); // 3️⃣ 전체 응답 확인
            console.log("📦 상품 리스트:", res.items); // 3️⃣ 리스트만 출력

            // 1️⃣ items 키가 없을 경우 대비해서 빈 배열 기본값 사용
            setProducts(res.items || []);
          })
          .catch((err) => console.error("네이버 API 에러:", err));
      })
      .catch((err) => console.error("Fragrance fetch error:", err));
  }, [product, scent, fragrance]);

  if (!scentGroup)
    return <div className="p-6">데이터를 불러오는 중입니다...</div>;

  return (
    <div className="p-8">
      {/* 🔙 상위 경로로 이동 */}
      <div className="mb-4 flex gap-4 text-sm">
        <Link href="/" className="text-blue-500 underline">← 홈</Link>
        <Link href={`/${product}`} className="text-blue-500 underline">← {product}</Link>
        <Link href={`/${product}/${scent}`} className="text-blue-500 underline">← {scentGroup.scent}</Link>
      </div>

      {/* 🧴 타이틀 정보 */}
      <h1 className="text-2xl font-bold mb-1">{product} - {scentGroup.scent}</h1>
      <h2 className="text-xl font-semibold mb-4">
        세부 향기: {scentGroup.fragrances.find(f => f.slug === fragrance)?.name}
      </h2>

      {/* 🔄 다른 fragrance 이동 버튼 */}
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
                src={item.image || "/no-image.png"}
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
