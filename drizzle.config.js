"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const drizzle_kit_1 = require("drizzle-kit");
if (!process.env.DATABASE_URL) {
    throw new Error('❌ Environment variable missing: DATABASE_URL');
}
const drizzleConfig = (0, drizzle_kit_1.defineConfig)({
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.DATABASE_URL,
    },
    out: './drizzle',
    schema: './drizzle/schema.ts',
});
exports.default = drizzleConfig;
