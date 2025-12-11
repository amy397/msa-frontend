import { atom, selector } from 'recoil';

// Áˆ ©] ÁÜ
export const productsState = atom({
  key: 'productsState',
  default: [],
});

// \) ÁÜ
export const productsLoadingState = atom({
  key: 'productsLoadingState',
  default: false,
});

// Ðì ÁÜ
export const productsErrorState = atom({
  key: 'productsErrorState',
  default: null,
});

//  Ý Áˆ
export const selectedProductState = atom({
  key: 'selectedProductState',
  default: null,
});

// Áˆ  (Ý ÁÜ)
export const productsCountState = selector({
  key: 'productsCountState',
  get: ({ get }) => {
    const products = get(productsState);
    return products.length;
  },
});
