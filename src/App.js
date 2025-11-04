import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { Routes, Route } from "react-router-dom";
import Login from "./Login";
import Home from "./Home";
import Registration from "./Registration";
import Profile from "./Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import RedirectIfAuthenticated from "./components/RedirectIfAuthenticated";
import Dashboard from "./Dashboard";
import Invoices from "./Invoices";
import Bills from "./Bills";
import Quotations from "./Quotations";

function App() {
  return (
    <div className="max-w-8l">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={
            <RedirectIfAuthenticated>
              <Login />{" "}
            </RedirectIfAuthenticated>
          }
        />
        <Route
          path="/register"
          element={
            <RedirectIfAuthenticated>
              <Registration />{" "}
            </RedirectIfAuthenticated>
          }
        />

        {/* Protected Profile Route */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            // <ProtectedRoute>
              <Dashboard />
            // </ProtectedRoute>
          }
        />
        <Route
          path="/invoices"
          element={
            // <ProtectedRoute>
              <Invoices />
            // </ProtectedRoute>
          }
        />
        <Route
          path="/bills"
          element={
            // <ProtectedRoute>
              <Bills />
            // </ProtectedRoute>
          }
        />
        <Route
          path="/quotations"
          element={
            // <ProtectedRoute>
              <Quotations />
            // </ProtectedRoute>
          }
        />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
