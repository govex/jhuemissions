import TopBar from "~/components/topBar/topbar";
import Footer from "~/components/footer/footer";
import { Outlet } from "react-router";
import type { Route } from "./+types/layout";

export default function Layout(props:Route.ComponentProps) {
    return (
        <>
        <TopBar />
        <Outlet />
        <Footer />
        </>
    )
}