'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from './ui/input';
import { Search } from 'lucide-react';
import { useDebounce } from '@/lib/hooks/useDebounce';

export function SearchBar() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());
        if (debouncedSearchTerm) {
            params.set('search', debouncedSearchTerm);
        } else {
            params.delete('search');
        }
        router.push(`/?${params.toString()}`);
    }, [debouncedSearchTerm, router, searchParams]);

    return (
        <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
                type="search"
                placeholder="Ürün ara..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
    );
} 