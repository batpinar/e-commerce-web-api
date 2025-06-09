'use client';

import Link from 'next/link';
import { Fragment } from 'react';
import { Popover, Transition } from '@headlessui/react';
import { Bars3Icon, ShoppingCartIcon, UserIcon } from '@heroicons/react/24/outline';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';

const navigation = [
  { name: 'Ana Sayfa', href: '/' },
  { name: 'Ürünler', href: '/products' },
  { name: 'Kategoriler', href: '/categories' }, // Assuming a categories listing page
  // Add more navigation links as needed based on your site structure
];

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      {/* Top bar */}
      <div className="bg-gray-900 py-2 text-center text-sm text-white">
        ÜCRETSİZ KARGO - 500 TL ve Üzeri Siparişlerde
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              SHOP.CO
            </Link>
          </div>

          {/* Search Bar (Desktop) */}
          <div className="ml-6 flex-1 hidden lg:flex">
            <div className="relative w-full max-w-lg">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                id="search"
                name="search"
                type="search"
                className="block w-full rounded-md border-0 bg-gray-100 py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                placeholder="Ürün ara..."
              />
            </div>
          </div>

          {/* Icons */}
          <div className="ml-4 flex items-center lg:ml-6">
            <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
              {/* User/Profile Icon */}
              <Link href="#" className="p-2 text-gray-400 hover:text-gray-500">
                <span className="sr-only">Hesap</span>
                <UserIcon className="h-6 w-6" aria-hidden="true" />
              </Link>
              <span className="h-6 w-px bg-gray-200" aria-hidden="true" />
            </div>

            {/* Cart Icon */}
            <div className="flow-root">
              <Link href="#" className="group -m-2 flex items-center p-2">
                <ShoppingCartIcon
                  className="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                  aria-hidden="true"
                />
                <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">0</span>
                <span className="sr-only">sepetteki ürün sayısı</span>
              </Link>
            </div>

            {/* Mobile menu button */}
            <Popover className="-m-2 ml-4 flow-root lg:hidden">
              <Popover.Button className="flex items-center justify-center rounded-md p-2 text-gray-400">
                <span className="sr-only">Menüyü aç</span>
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              </Popover.Button>
              <Transition
                as={Fragment}
                enter="duration-150 ease-out"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="duration-150 ease-in"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Popover.Panel
                  focus
                  className="absolute inset-x-0 top-16 mt-px bg-white pb-3 shadow-lg"
                >
                  <div className="space-y-1 px-2">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </Popover.Panel>
              </Transition>
            </Popover>
          </div>
        </div>
      </div>

      {/* Navigation Bar (Desktop) */}
      <nav className="hidden bg-gray-100 border-t border-gray-200 lg:block">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-10 items-center justify-center space-x-8">
            {navigation.map((item) => (
              <Link key={item.name} href={item.href} className="text-sm font-medium text-gray-700 hover:text-gray-800">
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
} 