import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  isAuthenticated: boolean;
  sessionId: string | null;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  sessionId: null,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<string>) => {
      state.isAuthenticated = true;
      state.sessionId = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.sessionId = null;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { loginSuccess, logout, setError , clearError } = authSlice.actions;

export default authSlice.reducer;
