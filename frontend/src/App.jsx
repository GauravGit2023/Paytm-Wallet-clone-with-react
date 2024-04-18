import React, { Suspense } from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import { Signup } from "./pages/Signup";
import { Signin } from "./pages/Signin";
import { Dashboard } from "./pages/Dashboard";
import { SendMoney } from "./pages/SendMoney";
// const Dashboard = React.lazy(() => import('./pages/Dashboard'));
// const Signin = React.lazy(() => import('./pages/Signin'));

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<Suspense fallback={"loading..."}><Signup /></Suspense>}></Route>
          <Route path="/signin" element={<Signin />}></Route>
          <Route path="/dashboard" element={<Dashboard />}></Route>
          <Route path="/send" element={<SendMoney />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
