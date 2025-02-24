"use strict";
var __awaiter =
    (this && this.__awaiter) ||
    function (thisArg, _arguments, P, generator) {
        function adopt(value) {
            return value instanceof P
                ? value
                : new P(function (resolve) {
                      resolve(value);
                  });
        }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }
            function rejected(value) {
                try {
                    step(generator["throw"](value));
                } catch (e) {
                    reject(e);
                }
            }
            function step(result) {
                result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
            }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, "__esModule", { value: true });
exports.userEmailverifyGet = void 0;
const error_1 = __importDefault(require("../../../../error"));
const recipe_1 = __importDefault(require("../../../emailverification/recipe"));
const emailverification_1 = __importDefault(require("../../../emailverification"));
const userEmailverifyGet = (_, options) =>
    __awaiter(void 0, void 0, void 0, function* () {
        const req = options.req;
        const userId = req.getKeyValueFromQuery("userId");
        if (userId === undefined) {
            throw new error_1.default({
                message: "Missing required parameter 'userId'",
                type: error_1.default.BAD_INPUT_ERROR,
            });
        }
        try {
            recipe_1.default.getInstanceOrThrowError();
        } catch (e) {
            return {
                status: "FEATURE_NOT_ENABLED_ERROR",
            };
        }
        const response = yield emailverification_1.default.isEmailVerified(userId);
        return {
            status: "OK",
            isVerified: response,
        };
    });
exports.userEmailverifyGet = userEmailverifyGet;
