import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface CartItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  quantity: number;
}

export interface CartState {
  value: number;
  items: CartItem[];
  restaurantId: string | null;
}

const loadCartFromStorage = (): CartState => {
  try {
    const saved = localStorage.getItem("cart");
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        value:
          parsed.items?.reduce((s: number, i: CartItem) => s + i.quantity, 0) ||
          0,
        items: parsed.items || [],
        restaurantId: parsed.restaurantId || null,
      };
    }
  } catch {
    /* ignore */
  }
  return { value: 0, items: [], restaurantId: null };
};

const saveCartToStorage = (state: CartState) => {
  localStorage.setItem(
    "cart",
    JSON.stringify({ items: state.items, restaurantId: state.restaurantId }),
  );
};

const initialState: CartState = loadCartFromStorage();

export const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    addToCart: (
      state,
      action: PayloadAction<
        Omit<CartItem, "quantity"> & { restaurantId?: string }
      >,
    ) => {
      const { restaurantId, ...item } = action.payload;
      // If adding from a different restaurant, clear the cart first
      if (
        restaurantId &&
        state.restaurantId &&
        state.restaurantId !== restaurantId
      ) {
        state.items = [];
      }
      if (restaurantId) {
        state.restaurantId = restaurantId;
      }
      const existing = state.items.find((i) => i._id === item._id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...item, quantity: 1 });
      }
      state.value = state.items.reduce((sum, i) => sum + i.quantity, 0);
      saveCartToStorage(state);
    },
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      if (state.value > 0) {
        state.value -= 1;
      }
    },
    incrementItem: (state, action: PayloadAction<string>) => {
      const item = state.items.find((i) => i._id === action.payload);
      if (item) {
        item.quantity += 1;
        state.value = state.items.reduce((sum, i) => sum + i.quantity, 0);
        saveCartToStorage(state);
      }
    },
    decrementItem: (state, action: PayloadAction<string>) => {
      const item = state.items.find((i) => i._id === action.payload);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
        state.value = state.items.reduce((sum, i) => sum + i.quantity, 0);
        saveCartToStorage(state);
      }
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((i) => i._id !== action.payload);
      state.value = state.items.reduce((sum, i) => sum + i.quantity, 0);
      if (state.items.length === 0) state.restaurantId = null;
      saveCartToStorage(state);
    },
    clearCart: (state) => {
      state.items = [];
      state.value = 0;
      state.restaurantId = null;
      saveCartToStorage(state);
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
  },
});

export const {
  addToCart,
  increment,
  decrement,
  incrementItem,
  decrementItem,
  removeItem,
  clearCart,
  incrementByAmount,
} = counterSlice.actions;

export default counterSlice.reducer;
