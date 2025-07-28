"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const driver_route_1 = require("../modules/driver/driver.route");
const auth_service_1 = require("../modules/auth/auth.service");
exports.router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/user",
        route: driver_route_1.UserRoutes,
    },
    {
        path: "/auth",
        route: auth_service_1.AuthRoutes,
    },
];
moduleRoutes.forEach((route) => {
    exports.router.use(route.path, route.route);
});
