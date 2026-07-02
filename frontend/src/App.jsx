import {BrowserRouter, Route, Routes} from 'react-router'
import SignInPage from './pages/SignInPage.jsx'
import SignUpPage from './pages/SignUpPage.jsx'
import ChatAppPage from './pages/ChatAppPage.jsx'
import { Toaster } from "sonner";
import ProtectedRoute from './components/ProtectedRoute.jsx';
function App() {

  return (
    <>
      <Toaster richColors/>
      <BrowserRouter>
      <Routes>
        {/* public routes */}
        <Route path="/signin" element={<SignInPage/>}/>
        <Route path="/signup" element={<SignUpPage/>}/>
        {/* protectect routes */}
        <Route element={<ProtectedRoute/>} >
          <Route path="/" element={<ChatAppPage/>}/>
        </Route>
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
