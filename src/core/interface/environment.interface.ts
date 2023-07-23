export interface Environment {
    MONGO_CONNECTION_URL: string;
    REDIS_HOST: string;
    REDIS_PORT: string;
    REDIS_USER_EXPIRE: string;
    JWT_SECRET: string;
    JWT_EXPIRES: string;
    JWT_ALGORITHM: string;
    CRYPTO_PASSWORD: string;
    ELASTICSEARCH_NODE: string;
    ELASTICSEARCH_USERNAME: string;
    ELASTICSEARCH_PASSWORD: string;
}
