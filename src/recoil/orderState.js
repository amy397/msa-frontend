import { atom, selector } from 'recoil';

// 유저 목록 상태
export const usersState = atom({
  key: 'usersState',
  default: [],
});

// 로딩 상태
export const usersLoadingState = atom({
  key: 'usersLoadingState',
  default: false,
});

// 에러 상태
export const usersErrorState = atom({
  key: 'usersErrorState',
  default: null,
});

// 선택된 유저
export const selectedUserState = atom({
  key: 'selectedUserState',
  default: null,
});

// 유저 수 (파생 상태)
export const usersCountState = selector({
  key: 'usersCountState',
  get: ({ get }) => {
    const users = get(usersState);
    return users.length;
  },
});