"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function PerfumePage() {
  const [scentCategories, setScentCategories] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/fragrances")
      .then((res) => res.json())
      .then((data) => setScentCategories(data))
      .catch((err) => console.error("API fetch error:", err));
  }, []);

  return (
    <div className="p-6">
      <motion.h1 
        className="text-3xl font-bold mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        향수 카테고리 - 향기 목록
      </motion.h1>

      <div className="grid grid-cols-2 gap-4">
        {scentCategories.map((category, index) => (
          <Link
            key={index}
            href={`/products/${category.scent}`}
            className="block p-4 bg-gray-100 rounded shadow hover:bg-gray-200 text-center"
          >
            {category.scent}
          </Link>
        ))}
      </div>
    </div>
  );
}
