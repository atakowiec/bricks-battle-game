import { createSlice } from '@reduxjs/toolkit';

export interface UserState {
  sub: string;
  nickname: string;
  loggedIn: boolean;
  admin: boolean;
}

const userSlice = createSlice({
  name: 'user',
  initialState: {
    loggedIn: false,
  } as UserState,
  reducers: {
    setUser: (_, action) => {
      if(!action.payload) {
        return {
          loggedIn: false
        };
      }

      action.payload.loggedIn = !!action.payload.sub;

      return action.payload;
    },
  },
});

export const userActions = userSlice.actions;

export default userSlice.reducer;
