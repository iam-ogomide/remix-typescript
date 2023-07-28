import { create } from "zustand";
import { ProductId } from "./interface";

interface State {
  cart: ProductId[];
  totalItems: number;
  totalPrice: number;
  showCart: boolean;
}


//Manipulate the data in the state
interface Actions {
  addToCart: (Item: ProductId) => void;
  removeFromCart: (Item: ProductId) => void;
  toggleShowCart: () => void;
}

export const useCartState = create<State & Actions>((set, get) => ({
    //shows that the cart will be empty when we first open it
  cart: [],
  totalItems: 0,
  totalPrice: 0,
  showCart: false,
  toggleShowCart: () => set((state) => ({ showCart: !state.showCart })),
  addToCart: (product: ProductId) => {
    // getting the cart items that are equal to the product slug
    const cart = get().cart;
    const cartItem = cart.find(
      (item) => item.slug.current === product.slug.current
    );

    // If statement to check if the item selected is already in the shopping bag
    if (cartItem) {
      const updateCart = cart.map((item) =>
        item.slug.current === product.slug.current
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );

      //Add 1 quantity if the item is alrady in the shopping bag
      set((state) => ({
        cart: updateCart,
        totalItems: state.totalItems + 1,
        totalPrice: state.totalPrice + product.price,
      }));
    } else {
        //Just add the product to the cart if the item is not yet in the cart
      const updatedCart = [...cart, { ...product, quantity: 1 }];

      set((state) => ({
        cart: updatedCart,
        totalItems: state.totalItems + 1,
        totalPrice: state.totalPrice + product.price,
      }));
    }
  },

  removeFromCart: (product: ProductId) => {
    set((state) => ({
      cart: state.cart.filter(
        (item) => item.slug.current !== product.slug.current
      ),
      totalItems: state.totalItems - 1,
      totalPrice: state.totalPrice - product.price,
    }));
  },
}));