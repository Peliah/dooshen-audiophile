import { CartItem, Product } from "@/lib/types";
import { toast } from "sonner";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type State = {
  products: Product[];
  cart: CartItem[];

  // computed
  cartItems: () => CartItem[];
  cartCount: () => number;
  cartTotal: () => number;
};

type Actions = {
  setProducts: (products: Product[]) => void;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (id: string) => void;
  updateQty: (id: string, quantity: number) => void;
  clearCart: () => void;
};

export const useStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      products: [],
      cart: [],

      setProducts: (products) => set({ products }),

      addToCart: (product, quantity = 1) => {
        const cart = get().cart;
        const exists = cart.find((c) => c.id === product.id);

        if (exists) {
          return set({
            cart: cart.map((c) =>
              c.id === product.id
                ? { ...c, quantity: c.quantity + quantity }
                : c
            ),
          });
        }

        set({ cart: [...cart, { ...product, quantity }] });
        toast.success("Added to cart successfully.");
      },

      removeFromCart: (id) => {
        set({ cart: get().cart.filter((c) => c.id !== id) });
        toast.success("Removed from cart successfully");
      },

      updateQty: (id, quantity) =>
        set({
          cart: get().cart.map((c) => (c.id === id ? { ...c, quantity } : c)),
        }),

      clearCart: () => {
        set({ cart: [] });
        toast.success("Cleared cart successfully");
      },
      cartItems: () => get().cart,
      cartCount: () => get().cart.reduce((acc, item) => acc + item.quantity, 0),
      cartTotal: () =>
        get().cart.reduce((acc, item) => acc + item.quantity * item.price, 0),
    }),
    {
      name: "audiophile",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const useCart = () => useStore((s) => s.cart);

export const useCartCount = () =>
  useStore((s) => s.cart.reduce((acc, item) => acc + item.quantity, 0));

export const useCartTotal = () =>
  useStore((s) =>
    s.cart.reduce((acc, item) => acc + item.quantity * item.price, 0)
  );
