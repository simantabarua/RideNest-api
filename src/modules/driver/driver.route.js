"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get("/", () => "user");
exports.UserRoutes = router;
