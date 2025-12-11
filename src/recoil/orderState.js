import { atom, selector } from 'recoil';

// 주문 목록 상태
export const ordersState = atom({
  key: 'ordersState',
  default: [],
});

// 로딩 상태
export const ordersLoadingState = atom({
  key: 'ordersLoadingState',
  default: false,
});

// 에러 상태
export const ordersErrorState = atom({
  key: 'ordersErrorState',
  default: null,
});

// 선택된 주문
export const selectedOrderState = atom({
  key: 'selectedOrderState',
  default: null,
});

// 주문 수 (파생 상태)
export const ordersCountState = selector({
  key: 'ordersCountState',
  get: ({ get }) => {
    const orders = get(ordersState);
    return orders.length;
  },
});
