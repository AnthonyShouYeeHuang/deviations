"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useYesterdayResults = useYesterdayResults;
var react_1 = require("react");
var core_1 = require("@acme/core");
var api_1 = require("../lib/api");
function useYesterdayResults() {
    var _this = this;
    var _a = (0, react_1.useState)({
        yesterdayId: "",
        problem: null,
        aggregates: null,
        yourAnswer: null,
        youWon: null,
        loading: true,
        error: null,
    }), state = _a[0], setState = _a[1];
    // helper to compute YYYY-MM-DD - 1 day from a YYYY-MM-DD string (server authoritative)
    function minusOneDay(id) {
        var d = new Date(id + "T00:00:00");
        d.setDate(d.getDate() - 1);
        return "".concat(d.getFullYear(), "-").concat(String(d.getMonth() + 1).padStart(2, "0"), "-").concat(String(d.getDate()).padStart(2, "0"));
    }
    var refetch = function () { return __awaiter(_this, void 0, void 0, function () {
        var today, yId, res, _a, problem, aggregates, yourAnswer, raw, parsed, youWon, detailAgg, map, _i, _b, _c, opt, n, resEval, e_1;
        var _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _e.trys.push([0, 3, , 4]);
                    setState(function (s) { return (__assign(__assign({}, s), { loading: true, error: null })); });
                    return [4 /*yield*/, (0, api_1.getToday)()];
                case 1:
                    today = _e.sent();
                    yId = minusOneDay(today.todayId);
                    return [4 /*yield*/, (0, api_1.getResults)(yId)];
                case 2:
                    res = _e.sent();
                    _a = res, problem = _a.problem, aggregates = _a.aggregates;
                    yourAnswer = null;
                    raw = localStorage.getItem("answer:".concat(yId));
                    if (raw) {
                        try {
                            parsed = JSON.parse(raw);
                            yourAnswer = (_d = parsed === null || parsed === void 0 ? void 0 : parsed.answer) !== null && _d !== void 0 ? _d : null;
                        }
                        catch (_f) { }
                    }
                    youWon = null;
                    if (problem && yourAnswer != null && (0, core_1.validateAnswer)(yourAnswer)) {
                        detailAgg = {};
                        if ((aggregates === null || aggregates === void 0 ? void 0 : aggregates.average) != null)
                            detailAgg.average = Number(aggregates.average);
                        if ((aggregates === null || aggregates === void 0 ? void 0 : aggregates.stddev) != null)
                            detailAgg.stddev = Number(aggregates.stddev);
                        if (Array.isArray(aggregates === null || aggregates === void 0 ? void 0 : aggregates.counts)) {
                            map = {};
                            for (_i = 0, _b = aggregates.counts; _i < _b.length; _i++) {
                                _c = _b[_i], opt = _c.opt, n = _c.n;
                                map[opt] = n;
                            }
                            detailAgg.counts = map;
                        }
                        resEval = (0, core_1.evaluate)(problem, yourAnswer, detailAgg);
                        youWon = !!resEval.won;
                    }
                    setState({
                        yesterdayId: yId,
                        problem: problem,
                        aggregates: aggregates,
                        yourAnswer: yourAnswer,
                        youWon: youWon,
                        loading: false,
                        error: null
                    });
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _e.sent();
                    setState(function (s) { return (__assign(__assign({}, s), { loading: false, error: String((e_1 === null || e_1 === void 0 ? void 0 : e_1.message) || e_1) })); });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    (0, react_1.useEffect)(function () { void refetch(); }, []);
    return [state, refetch];
}
