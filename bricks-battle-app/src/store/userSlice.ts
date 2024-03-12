import { createSlice } from '@reduxjs/toolkit';

export interface UserStateData {
  sub: string;
  nickname: string;
}

export type UserState = UserStateData | null;

const userSlice = createSlice({
  name: 'user',
  initialState: null as UserState,
  reducers: {
    setUser: (_, action) => {
      if(!action.payload) {
        return null;
      }

      return action.payload;
    },
  },
});

export const userActions = userSlice.actions;

export default userSlice.reducer;
