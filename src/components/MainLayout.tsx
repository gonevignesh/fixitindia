import { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface MainLayoutProps {
    children: ReactNode;
    showNavbar?: boolean;
    showFooter?: boolean;
    isHome?: boolean;
}

const MainLayout = ({ children, showNavbar = true, showFooter = true, isHome = false }: MainLayoutProps) => {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            {showNavbar && <Navbar isHome={isHome} />}
            <main className="flex-1">
                {children}
            </main>
            {showFooter && <Footer />}
        </div>
    );
};

export default MainLayout;
