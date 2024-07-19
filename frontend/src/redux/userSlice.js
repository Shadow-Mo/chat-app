import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        authUser: null,
        otherUsers: null,
        selectedUser: null,
        onlineUsers: null,
        groups: null, // Add groups state
        selectedGroup: null // Add selectedGroup state
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
            state.groups = action.payload;
        },
        setSelectedGroup: (state, action) => {
            state.selectedGroup = action.payload;
        }
    }
});

export const {
    setAuthUser,
    setOtherUsers,
    setSelectedUser,
    setOnlineUsers,
    setGroups,
    setSelectedGroup // Export setSelectedGroup action
} = userSlice.actions;

export default userSlice.reducer;
