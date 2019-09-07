export interface Config {
    port: number | string
    prettyLog: boolean
    dbInfo: Database
}

export interface Database {
    pgUser: string
    pgHost: string
    pgPass: string
    pgDatabase: string
    pgPort: number | string
}

const config: Config = {
    port: process.env.NODE_PORT || 3000,
    prettyLog: process.env.NODE_ENV === 'development',
    dbInfo: {
        pgUser: process.env.PGUSER || 'postgres',
        pgHost: process.env.PGHOST || 'localhost',
        pgPass: process.env.PGPASSWORD || '',
        pgDatabase: process.env.PGDATABASE || '',
        pgPort: process.env.PGPORT || 5432
    }
}

export { config }
