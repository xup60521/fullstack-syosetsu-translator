import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/app.tsx"),
    route("api/decompose_url", "api/decompose_url.ts"),
    route("api/novel_handler", "api/novel_handler/novel_handler.ts"),
    route("login", "routes/login.tsx"),
    route("api/auth/*", "api/auth/auth-handler.ts"),
    route("api/translate", "api/translate.ts"),
    route("api/encrypt-api-key", "api/encrypt-api-key.ts"),
] satisfies RouteConfig;
