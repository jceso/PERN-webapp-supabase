import Navbar from './components/Navbar';
import { Outlet, useLocation } from "react-router-dom";

const Layout = () => {
  const location = useLocation();
  const isAuthPage = ["/login", "/signup"].includes(location.pathname);

  return (
    <div>
      {!isAuthPage && <Navbar />}
      <main className="p-4 pt-20">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;