import TopBar from "~/components/topBar/topbar";
import Footer from "~/components/footer/footer";
import { Outlet, useNavigation } from "react-router";
import type { Route } from "./+types/layout";
import { createTheme, ThemeProvider } from "@mui/material";

const theme = createTheme({
    typography: {
        fontFamily: ['gentona', 'Roboto', 'sans-serif'].join(',')
    }
})
export default function Layout(props:Route.ComponentProps) {
  const navigation = useNavigation();
  const isNavigating = navigation.state === 'loading';
  console.log("navigating: ", isNavigating);
    return (
        <ThemeProvider theme={theme}>
            {isNavigating && (
                <div className="spinner-overlay">
                  <div className="spinner"></div>
                </div>
            )}
            <TopBar />
            <Outlet />
            <Footer />
        </ThemeProvider>
    )
}