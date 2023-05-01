import { useNavigate, useLocation } from "react-router-dom";
import styles from "./NavBar.module.css";
import { useEffect } from "react";

const NavBar = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const pathName = location.pathname;
    if (pathName === "/") {
    }
  }, [location]);

  const setNavigation = (url: string) => {
    navigate(url);
  };

  return (
    <>
      {children}
      {location.pathname !== "/" && (
        <nav className={styles.navBar}>
          <button
            className={styles.navBtns}
            onClick={() => setNavigation("/main")}
          >
            HOME
          </button>
          <button
            className={styles.navBtns}
            onClick={() => setNavigation("/about")}
          >
            ABOUT
          </button>
          <button
            className={styles.navBtns}
            onClick={() => setNavigation("/profile")}
          >
            PROFILE
          </button>
        </nav>
      )}
    </>
  );
};

export default NavBar;
