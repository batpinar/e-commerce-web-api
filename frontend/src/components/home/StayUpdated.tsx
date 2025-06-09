'use client';

import React from 'react';

export default function StayUpdated() {
  return (
    <div className="bg-gray-900 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Güncel Kalın</h2>
        <p className="mt-4 text-lg leading-6 text-gray-300">Yeni ürünler ve özel tekliflerden ilk siz haberdar olun.</p>
        <div className="mt-8 flex justify-center">
          <div className="flex w-full max-w-md">
            <label htmlFor="email-address" className="sr-only">
              E-posta adresi
            </label>
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="min-w-0 flex-auto rounded-md border-0 bg-white px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary-500 sm:text-sm sm:leading-6"
              placeholder="E-posta adresinizi girin"
            />
            <button
              type="submit"
              className="flex-none rounded-md bg-primary-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 ml-4"
            >
              Abone Ol
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 