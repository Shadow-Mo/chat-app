import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        authUser: null,
        otherUsers: null,
        selectedUser: null,
        onlineUsers: null,
        groups: null, // Add groups to the initial state
    },
    reducers: {
        setAuthUser: (state, action) => {
            state.authUser = action.payload;
        },
        setOtherUsers: (state, action) => {
            state.otherUsers = action.payload;
        },
        setSelectedUser: (state, action) => {
            state.selectedUser = action.payload;
        },
        setOnlineUsers: (state, action) => {
            state.onlineUsers = action.payload;
        },
        setGroups: (state, action) => {
            state.groups = action.payload; // Add setGroups action
        },
    }
});
export const { setAuthUser, setOtherUsers, setSelectedUser, setOnlineUsers, setGroups } = userSlice.actions;
export default userSlice.reducer;
