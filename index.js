"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("@apollo/server");
const kinde_node_1 = __importDefault(require("@kinde-oss/kinde-node"));
const standalone_1 = require("@apollo/server/standalone");
const types_js_1 = require("./src/types.js");
const celebrity_js_1 = require("./src/resolvers/celebrity.js");
const fan_js_1 = require("./src/resolvers/fan.js");
const business_js_1 = require("./src/resolvers/business.js");
const review_js_1 = require("./src/resolvers/review.js");
const work_js_1 = require("./src/resolvers/work.js");
const date_js_1 = require("./src/resolvers/date.js");
const user_js_1 = require("./src/resolvers/user.js");
(function () {
    return __awaiter(this, void 0, void 0, function* () {
        const authorize = yield (0, kinde_node_1.default)(process.env.KINDE_DOMAIN);
        const resolvers = {
            Date: date_js_1.resolverMap,
            Query: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, user_js_1.userQuery), celebrity_js_1.celebrityQuery), fan_js_1.fanQuery), business_js_1.businessQuery), review_js_1.reviewQuery),
            Mutation: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, user_js_1.userMutation), celebrity_js_1.celebrityMutation), fan_js_1.fanMutation), business_js_1.businessMutation), review_js_1.reviewMutation), work_js_1.workMutation)
        };
        const server = new server_1.ApolloServer({
            typeDefs: types_js_1.typeDefs,
            resolvers
        });
        const { url } = yield (0, standalone_1.startStandaloneServer)(server, {
            listen: { port: 3001 },
            /*context: async ({ req }) => {
                // auth check on every request
                const user = await new Promise((resolve, reject) => {
                    authorize(req, (err: any, user: any) => {
                        if (err) {
                            return reject(err);
                        }
                        resolve(user);
                    });
                });
            
                return {
                    user
                };
            }*/
        });
        console.log('Server listening at ' + url);
    });
})();
