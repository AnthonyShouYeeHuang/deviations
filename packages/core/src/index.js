"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deviceKey = deviceKey;
exports.validateAnswer = validateAnswer;
__exportStar(require("./types.js"), exports);
__exportStar(require("./time.js"), exports);
__exportStar(require("./win.js"), exports);
/** A stable per-device key; stored in localStorage. */
function deviceKey() {
    var k = localStorage.getItem("devkey");
    if (k)
        return k;
    var v = crypto.randomUUID();
    localStorage.setItem("devkey", v);
    return v; // <-- return the new value, not k
}
/** Minimal validation for answers. Extend later per winType. */
function validateAnswer(a) {
    if (typeof a === "string")
        return a.trim().length > 0;
    if (typeof a === "number")
        return Number.isFinite(a);
    if (typeof a === "object" && a !== null && "optionId" in a)
        return typeof a.optionId === "string";
    return false;
}
