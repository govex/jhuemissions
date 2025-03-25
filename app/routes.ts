import { type RouteConfig, index, route, layout } from "@react-router/dev/routes";

export default [
    layout("routes/layout.tsx", [
        index("routes/homePage/homepage.tsx"),
        route("about", "routes/about/about.tsx"),
        route("methodology", "routes/methodology/methodology.tsx")
    ])
] satisfies RouteConfig;