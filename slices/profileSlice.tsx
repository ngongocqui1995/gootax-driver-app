import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: "",
  name: "",
  phone: "",
  email: "",
  avatar: "",
  gender: "",
  location: { lat: 0, lng: 0 },
};

export const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    updateProfileInfo: (state: any, action: any) => {
      const data = action.payload;
      return { ...state, ...data };
    },
    resetProfile: () => initialState,
  },
});

export const { updateProfileInfo, resetProfile } = profileSlice.actions;

export const profileInfo = (state: any) => state.profile;

export default profileSlice.reducer;
