import React from 'react';

const brands = [
  'Versace',
  'Zara',
  'Gucci',
  'Prada',
  'Calvin Klein',
];

export default function BrandLogos() {
  return (
    <section className="w-full bg-white py-6 flex justify-center items-center border-b">
      <div className="flex flex-wrap gap-8 justify-center items-center">
        {brands.map((brand) => (
          <span key={brand} className="text-2xl font-semibold tracking-wide text-gray-700 opacity-80 hover:opacity-100 transition">
            {brand}
          </span>
        ))}
      </div>
    </section>
  );
} 