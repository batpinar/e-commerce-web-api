import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  id: string;
  product: {
    id: string;
    name: string;
    price: number;
    stock: number;
    images: string[];
    category: {
      name: string;
    };
  };
  quantity: number;
  note?: string;
}

interface CartState {
  items: CartItem[];
  total: number;
  isLoading: boolean;
  error: string | null;
  setItems: (items: CartItem[]) => void;
  setTotal: (total: number) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  addItem: (item: CartItem) => void;
  updateItem: (id: string, quantity: number, note?: string) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      total: 0,
      isLoading: false,
      error: null,
      setItems: (items) => set({ items }),
      setTotal: (total) => set({ total }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      addItem: (item) =>
        set((state) => {
          const existingItem = state.items.find((i) => i.product.id === item.product.id);
          if (existingItem) {
            const updatedItems = state.items.map((i) =>
              i.product.id === item.product.id
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            );
            return { items: updatedItems };
          }
          return { items: [...state.items, item] };
        }),
      updateItem: (id, quantity, note) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity, note } : item
          ),
        })),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),
      clearCart: () => set({ items: [], total: 0 }),
    }),
    {
      name: 'cart-storage',
    }
  )
); 