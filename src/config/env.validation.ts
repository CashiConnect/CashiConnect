export function validateEnv(config: Record<string, unknown>) {
  const required = [
    'DB_HOST',
    'DB_PORT',
    'DB_USERNAME',
    'DB_PASSWORD',
    'DB_DATABASE',
    'JWT_SECRET',
  ];

  const missing = required.filter((key) => !config[key]);
  if (missing.length > 0) {
    throw new Error(`Missing environment variables: ${missing.join(', ')}`);
  }

  const port = Number(config.DB_PORT);
  if (Number.isNaN(port)) {
    throw new Error('DB_PORT must be a number');
  }

  return { ...config, DB_PORT: port };
}