import { type RouteConfig, index, route, layout, prefix } from "@react-router/dev/routes";

export default [
    layout("routes/layout.tsx", [
        index("routes/about/about.tsx"),
        route("dashboard", "routes/dashboard/dashboard.tsx"),
        route("methodology", "routes/methodology/methodology.tsx"),
        ...prefix("auth/oidc", [
            route("callback", "routes/auth/callback.tsx")
        ])
    ])
] satisfies RouteConfig;