import { Outlet } from "react-router-dom";
import Navbar from "../../components/Navbar";
import FooterComponents from "../../components/FooterComponents";
import { Toolbar } from "@mui/material";

const Layout = () => {
  return (
    <>
      <header className="App">
        <Navbar />
        <Toolbar/>
      </header>
      <main>
        <Outlet />
      </main>
      <footer>
        {/* <Footer /> */}
        <FooterComponents/>
      </footer>
    </>
  );
};

export default Layout;
