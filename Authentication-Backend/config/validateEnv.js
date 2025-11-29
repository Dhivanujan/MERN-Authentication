const REQUIRED_KEYS = [
  'MONGO_URI',
  'JWT_SECRET',
];

export const validateEnv = () => {
  const missing = REQUIRED_KEYS.filter((key) => !process.env[key]);

  if (missing.length) {
    const list = missing.join(', ');
    throw new Error(`Missing required environment variables: ${list}`);
  }
};

export default validateEnv;
