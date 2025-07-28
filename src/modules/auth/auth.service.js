"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get("/", () => "auth");
exports.AuthRoutes = router;
