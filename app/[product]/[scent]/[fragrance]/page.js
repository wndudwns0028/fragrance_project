"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

/**
 * 📄 세부 향기 상세 페이지 (/bodywash/fruity/grapefruit 등)
 * - 네이버 쇼핑에서 해당 향기의 상품을 검색
 * - 여러 검색어를 동시에 시도 (Promise.all)
 */
export default function FragranceDetailPage() {
  // ✅ 현재 URL에서 제품명, scent slug, fragrance slug 추출
  const { product, scent, fragrance } = useParams();

  // 🔧 상태 관리
  const [scentGroup, setScentGroup] = useState(null); // scent + fragrance 정보
  const [products, setProducts] = useState([]);       // 네이버 검색 결과

  /**
   * ✅ 컴포넌트 마운트 시 실행
   * - fragrance 목록 중 현재 페이지에 해당하는 항목 찾기
   * - 검색 쿼리 구성 후 병렬 fetch 실행
   */
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/fragrances`)
      .then((res) => res.json())
      .then((data) => {
        // 1. 현재 제품의 scent 그룹 찾기
        const found = data.find(
          (item) => item.product === product && item.scent_slug === scent
        );
        if (!found) return;

        setScentGroup(found); // scent 정보 저장

        // 2. 해당 fragrance 찾기
        const targetFragrance = found.fragrances.find(
          (f) => f.slug === fragrance
        );
        if (!targetFragrance) return;

        // 3. "자몽향" → "자몽" 으로 정리
        const cleanedName = targetFragrance.name.replace(/향$/, "");

        // 4. 검색 쿼리 후보 (2단계)
        const queries = [
          `${cleanedName} ${product}`,  // ex: 자몽 바디워시
          `${cleanedName} 샤워젤`,      // ex: 자몽 샤워젤
        ];

        // 5. 병렬로 검색
        fetchWithPromiseAll(queries);
      })
      .catch((err) => console.error("향기 정보 로딩 실패:", err));
  }, [product, scent, fragrance]);

  /**
   * 🌀 Promise.all로 병렬 fetch 수행
   * - 여러 쿼리를 동시에 요청
   * - 결과가 있는 첫 번째 쿼리 결과만 사용
   */
  async function fetchWithPromiseAll(queryList) {
    try {
      // 모든 쿼리를 동시에 요청
      const responses = await Promise.all(
        queryList.map(async (rawQuery) => {
          const encoded = encodeURIComponent(rawQuery);
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/naver/search?query=${encoded}`);
          const json = await res.json();
          return { rawQuery, items: json.items };
        })
      );

      // 결과가 있는 첫 번째 쿼리 사용
      const found = responses.find((r) => r.items && r.items.length > 0);
      if (found) {
        console.log("✅ 성공한 쿼리:", found.rawQuery, "| 결과 수:", found.items.length);
        setProducts(found.items);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error("🧨 병렬 fetch 실패:", err);
      setProducts([]);
    }
  }

  // 🕐 데이터 로딩 중 표시
  if (!scentGroup) return <div className="p-6">데이터를 불러오는 중입니다...</div>;

  return (
    <div className="p-8">
      {/* 상단 내비게이션 링크 */}
      <div className="mb-4 flex gap-4 text-sm">
        <Link href="/" className="text-blue-500 underline">← 홈</Link>
        <Link href={`/${product}`} className="text-blue-500 underline">← {product}</Link>
        <Link href={`/${product}/${scent}`} className="text-blue-500 underline">← {scentGroup.scent}</Link>
      </div>

      {/* 제목 영역 */}
      <h1 className="text-2xl font-bold mb-1">{product} - {scentGroup.scent}</h1>
      <h2 className="text-xl font-semibold mb-4">
        세부 향기: {scentGroup.fragrances.find(f => f.slug === fragrance)?.name}
      </h2>

      {/* 다른 fragrance 버튼 */}
      <div className="flex gap-2 flex-wrap mb-6">
        {scentGroup.fragrances.map((f, i) => (
          <Link
            key={i}
            href={`/${product}/${scent}/${f.slug}`}
            className={`px-4 py-2 rounded-full border text-sm cursor-pointer hover:bg-blue-100 ${f.slug === fragrance ? "bg-blue-200 font-semibold" : ""}`}
          >
            {f.name}
          </Link>
        ))}
      </div>

      {/* 검색 결과 */}
      {products.length === 0 ? (
        <p className="text-gray-500">관련 상품이 없습니다.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((item, idx) => (
            <div key={idx} className="border rounded-lg shadow p-4 bg-white flex flex-col">
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
