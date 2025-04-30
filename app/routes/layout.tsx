import TopBar from "~/components/topBar/topbar";
import Footer from "~/components/footer/footer";
import { Outlet } from "react-router";
import type { Route } from "./+types/layout";
import { createTheme, ThemeProvider } from "@mui/material";

const theme = createTheme({
    typography: {
        fontFamily: ['gentona', 'Roboto', 'sans-serif'].join(',')
    }
})
export default function Layout(props:Route.ComponentProps) {
    return (
        <ThemeProvider theme={theme}>
            <TopBar />
            <Outlet />
            <Footer />
        </ThemeProvider>
    )
}