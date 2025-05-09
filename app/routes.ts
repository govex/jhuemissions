import { type RouteConfig, index, route, layout } from "@react-router/dev/routes";

export default [
    layout("routes/layout.tsx", [
        index("routes/about/about.tsx"),
        route("dashboard", "routes/dashboard/dashboard.tsx"),
        route("methodology", "routes/methodology/methodology.tsx")
    ])
] satisfies RouteConfig;