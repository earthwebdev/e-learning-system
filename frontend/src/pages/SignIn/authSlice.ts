import { createSlice } from '@reduxjs/toolkit'

interface authInterface {
    isLoggedIn: boolean;
    jwt: string;
    role: string;
}

const initialState: authInterface = {
    isLoggedIn: false,
    jwt: "",
    role: ""
}

const authSlice = createSlice({
  name: 'Auth',
  initialState,
  reducers: {    
    login: (state, action) => {
        //console.log(action.payload);
        state.isLoggedIn = true;
        state.jwt = action.payload.jwt;
        state.role = action.payload.role;
        //console.log(state.jwt, 'token', state.role, 'roles');
    },
    logout: (state) => {
        state.isLoggedIn = false;
        state.jwt = "";
        state.role = "";
    }
  }
});

// Action creators are generated for each case reducer function
export const { login, logout } = authSlice.actions;

export default authSlice.reducer;