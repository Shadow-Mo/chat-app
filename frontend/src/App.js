import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Signup from './components/Signup';
import HomePage from './components/HomePage';
import Login from './components/Login';
import { BASE_URL } from './config';
import GroupChat from './components/GroupChat';

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />
  },
  {
    path: "/signup",
    element: <Signup />
  },
  {
    path: "/login",
    element: <Login />
  },{
    path: "groupchat",
    element: <GroupChat />
  }
]);

function App() {
  const { authUser } = useSelector(store => store.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (authUser) {
      dispatch({ type: 'INIT_SOCKET', payload: { userId: authUser._id } });
    }
  }, [authUser, dispatch]);

  return (
    <div className="p-4 h-screen flex items-center justify-center">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
