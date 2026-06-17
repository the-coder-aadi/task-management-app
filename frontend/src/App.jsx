import {
 BrowserRouter,
 Route,
 Routes,
 Navigate
} from "react-router-dom"
import SignUp from "./pages/SignUp"
import Otp from "./pages/otp"
import Login from "./pages/Login"
import Home from "./pages/Home"
import ProtectedRoute from "./pages/ProtectedRoute"
import Forgotpass from "./pages/forgotpass"
import Resetpass from "./pages/reset-password"
import TaskView from "./pages/taskview"

function App() {

const token = localStorage.getItem("token")
  return(
    <BrowserRouter>
    <Routes>
            <Route
          path="/"
          element={
            token ? <Navigate to="/home" /> : <SignUp />
          }
        />
      <Route path="/otp" element={<Otp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-pass" element={<Forgotpass />} />
      <Route path="/reset-password/:token" element={<Resetpass />} />
      <Route path="/task/:id" element={<TaskView />} />
       <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
    </Routes>
    </BrowserRouter>
  )
}
export default App