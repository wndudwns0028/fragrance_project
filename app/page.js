"use client";


import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

const scentCategories = [
  {
    category: "과일향",
    scents: ["사과", "복숭아", "체리", "망고", "레몬"]
  },
  {
    category: "산뜻한 향",
    scents: ["시트러스", "그린티", "민트", "유칼립투스", "오션"]
  },
  {
    category: "우디 향",
    scents: ["샌달우드", "시더우드", "파촐리", "베티버"]
  },
  {
    category: "플로럴 향",
    scents: ["로즈", "라벤더", "쟈스민", "히아신스"]
  }
];

export default function HomePage() {
  const [hoveredCategory, setHoveredCategory] = useState(null);

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-4">
      <motion.h1 
        className="text-4xl font-bold mb-6 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        향기 기반 화장품 추천
      </motion.h1>

      <div className="w-full max-w-lg">
        <Input type="text" placeholder="원하는 향을 검색해보세요..." className="mb-4" />
        <Button className="w-full">검색</Button>
      </div>

      <nav className="mt-8 w-full max-w-3xl bg-white p-4 shadow-md rounded-lg flex justify-around">
        {scentCategories.map((category, index) => (
          <div 
            key={index} 
            className="relative"
            onMouseEnter={() => setHoveredCategory(category.category)}
            onMouseLeave={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget)) {
                setHoveredCategory(null);
              }
            }}
          >
            <button className="text-lg font-semibold px-4 py-2 hover:text-blue-500">{category.category}</button>
            {hoveredCategory === category.category && (
              <motion.div 
                className="absolute left-0 top-full mt-2 bg-white shadow-lg rounded-lg p-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                onMouseEnter={() => setHoveredCategory(category.category)}
                onMouseLeave={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget)) {
                    setHoveredCategory(null);
                  }
                }}
              >
                {category.scents.map((scent, scentIndex) => (
                  <div key={scentIndex} className="px-4 py-2 text-gray-700 hover:bg-gray-200 cursor-pointer rounded">
                    {scent}
                  </div>
                ))}
              </motion.div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
}
