'use client';

import Link from 'next/link';
import { LinkIcon } from '@heroicons/react/24/outline'; // Using LinkIcon as placeholder

const footerNavigation = {
  company: [
    { name: 'Hakkımızda', href: '#' },
    { name: 'Kariyer', href: '#' },
    { name: 'Basın', href: '#' },
    { name: 'Ortaklık', href: '#' },
  ],
  shop: [
    { name: 'Mağaza', href: '/products' },
    { name: 'Kategoriler', href: '/categories' },
    { name: 'İndirimler', href: '#' },
  ],
  help: [
    { name: 'Dest destek', href: '#' },
    { name: 'Kargo Detayları', href: '#' },
    { name: 'İade Politikası', href: '#' },
    { name: 'Sipariş Takibi', href: '#' },
  ],
  social: [
    // Using LinkIcon as a placeholder for social media icons.
    // For specific social media brand icons, you might need to install a different library (e.g., react-icons) or use custom SVGs.
    { name: 'Facebook', href: '#', icon: (props: any) => <LinkIcon {...props} /> },
    { name: 'Instagram', href: '#', icon: (props: any) => <LinkIcon {...props} /> },
    { name: 'Twitter', href: '#', icon: (props: any) => <LinkIcon {...props} /> },
    { name: 'LinkedIn', href: '#', icon: (props: any) => <LinkIcon {...props} /> },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              SHOP.CO
            </Link>
            <p className="text-sm leading-6 text-gray-600">
              Moda ve stil dünyasına hoş geldiniz. En son trendleri ve zamansız parçaları keşfedin.
            </p>
            <div className="flex space-x-6">
              {footerNavigation.social.map((item) => (
                <a key={item.name} href={item.href} className="text-gray-400 hover:text-gray-500">
                  <span className="sr-only">{item.name}</span>
                  <item.icon className="h-6 w-6" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-gray-900">Şirket</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {footerNavigation.company.map((item) => (
                    <li key={item.name}>
                      <Link href={item.href} className="text-sm leading-6 text-gray-600 hover:text-gray-900">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-gray-900">Mağaza</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {footerNavigation.shop.map((item) => (
                    <li key={item.name}>
                      <Link href={item.href} className="text-sm leading-6 text-gray-600 hover:text-gray-900">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-gray-900">Yardım</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {footerNavigation.help.map((item) => (
                    <li key={item.name}>
                      <Link href={item.href} className="text-sm leading-6 text-gray-600 hover:text-gray-900">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              {/* TODO: Add Contact or other sections based on Figma */}
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-900/10 pt-8">
          <p className="text-xs leading-5 text-gray-500">&copy; 2023 SHOP.CO, Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
} 