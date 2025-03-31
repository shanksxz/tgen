import { sql } from "drizzle-orm";
export function getISOFormatDateQuery(dateTimeColumn) {
    return sql `to_char(${dateTimeColumn}, 'YYYY-MM-DD"T"HH24:MI:SS"Z"')`;
}
export const getEnvVar = (name) => {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing environment variable: ${name}`);
    }
    return value;
};
