import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/*** SUPABASE ***/
import type { Cart, CartTwo, User, Products } from '@/src/utils/supabase';

type State = {
  //cart: any;
  cart: Cart[] | [];
  account: User | null;
};

type Test = {
  prevState: State & Action;
};

type Action = {
  addToCart: (product: Products) => void;
  removeFromCart: (product: Products) => void;
  addQuantity: (product: Products) => void;
  subtractQuantity: (product: Products) => void;
  clearTrolley: (cart: State['cart']) => void;
  setAccount: (account: State['account']) => void;
};

export const useStore = create<State & Action>()(
  persist(
    (set, get) => ({
      cart: [],
      addToCart: (product) => {
        set((state) => ({
          cart: [
            ...state.cart,
            {
              ...product,
              cart_quantity: 1,
            } as Cart,
          ],
        }));
      },

      removeFromCart: (product) => {
        set((state) => {
          const index = state.cart.findIndex(
            (state) => state.sku === product.sku
          );
          state.cart.splice(index, 1);
          return {
            cart: [
              ...state.cart,
              {
                ...product,
                cart_quantity: 1,
              } as Cart,
            ],
          };
        });
      },

      addQuantity: (product) => {
        set((state) => {
          // find the product
          const item = state.cart.find((state) => state.sku === product.sku);
          item!.cart_quantity++;

          return {
            cart: [...state.cart],
          };
        });
      },

      subtractQuantity: (product) => {
        set((state) => {
          // find the product
          const item = state.cart.find((state) => state.sku === product.sku);

          if (item!.cart_quantity === 1) {
            // find the product to remove
            const index = state.cart.findIndex(
              (state) => state.sku === product.sku
            );

            state.cart.splice(index, 1); // remove from cart array

            return {
              cart: [...state.cart],
            };
          } else {
            // decrement product quantity
            item!.cart_quantity--;

            return {
              cart: [...state.cart],
            };
          }
        });
      },
      clearTrolley: () => set({ cart: [] }),
      account: null,
      setAccount: (account) => set(() => ({ account })),
    }),
    {
      name: 'settings', // storage item name
      storage: createJSONStorage(() => localStorage),
    }
  )
);
