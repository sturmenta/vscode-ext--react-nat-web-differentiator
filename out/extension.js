"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
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
var vscode = require("vscode");
var path = require("path");
function activate(context) {
    function getPackageColors() {
        return __awaiter(this, void 0, void 0, function () {
            var workspaceFolders, workspacePath, fullPath, document, text, json, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        workspaceFolders = vscode.workspace.workspaceFolders;
                        if (workspaceFolders === undefined)
                            return [2 /*return*/, {}];
                        workspacePath = workspaceFolders[0].uri.fsPath;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        fullPath = path.join(workspacePath, 'package.json');
                        return [4 /*yield*/, vscode.workspace.openTextDocument(fullPath)];
                    case 2:
                        document = _a.sent();
                        text = document.getText();
                        json = JSON.parse(text);
                        if (json.react_nat_web_differentiator !== undefined)
                            return [2 /*return*/, json.react_nat_web_differentiator];
                        else
                            return [2 /*return*/, {
                                    web: 'rgba(0, 205, 30, .25)',
                                    native: 'rgba(134, 91, 217, .25)'
                                }];
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/, {}];
                }
            });
        });
    }
    function start() {
        return __awaiter(this, void 0, void 0, function () {
            function triggerUpdateDecorations() {
                if (timeout)
                    clearTimeout(timeout);
                timeout = setTimeout(updateDecorations, 500);
            }
            function updateDecorations() {
                if (!activeEditor)
                    return;
                var text = activeEditor.document.getText();
                //
                var web_regEx = /\/\*.*\*web\*\/|.*\/\/web|\/\*web\*\/.*|.*start_web[\s\S]*?end_web/gm;
                var native_regEx = /\/\*.*\*native\*\/|.*\/\/native|\/\*native\*\/.*|.*start_native[\s\S]*?end_native/gm;
                //
                var web_area = [];
                var native_area = [];
                var match;
                while (match = web_regEx.exec(text)) {
                    var startPos = activeEditor.document.positionAt(match.index);
                    var endPos = activeEditor.document.positionAt(match.index + match[0].length);
                    var decoration = { range: new vscode.Range(startPos, endPos) };
                    web_area.push(decoration);
                }
                while (match = native_regEx.exec(text)) {
                    var startPos = activeEditor.document.positionAt(match.index);
                    var endPos = activeEditor.document.positionAt(match.index + match[0].length);
                    var decoration = { range: new vscode.Range(startPos, endPos) };
                    native_area.push(decoration);
                }
                activeEditor.setDecorations(web_DecorationType, web_area);
                activeEditor.setDecorations(native_DecorationType, native_area);
            }
            var colors, web_DecorationType, native_DecorationType, activeEditor, timeout;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, getPackageColors()];
                    case 1:
                        colors = _a.sent();
                        web_DecorationType = vscode.window.createTextEditorDecorationType({
                            overviewRulerColor: colors.web,
                            backgroundColor: colors.web,
                            overviewRulerLane: vscode.OverviewRulerLane.Right,
                        });
                        native_DecorationType = vscode.window.createTextEditorDecorationType({
                            overviewRulerColor: colors.native,
                            backgroundColor: colors.native,
                            overviewRulerLane: vscode.OverviewRulerLane.Right,
                        });
                        activeEditor = vscode.window.activeTextEditor;
                        if (activeEditor)
                            triggerUpdateDecorations();
                        vscode.window.onDidChangeActiveTextEditor(function (editor) {
                            activeEditor = editor;
                            if (editor)
                                triggerUpdateDecorations();
                        }, null, context.subscriptions);
                        vscode.workspace.onDidChangeTextDocument(function (event) {
                            if (activeEditor && event.document === activeEditor.document)
                                triggerUpdateDecorations();
                        }, null, context.subscriptions);
                        timeout = null;
                        return [2 /*return*/];
                }
            });
        });
    }
    start();
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map