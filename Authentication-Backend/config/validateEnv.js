const REQUIRED_KEYS = ["MONGO_URI", "JWT_SECRET"];

const isNonEmpty = (value) => typeof value === "string" && value.trim().length > 0;

const isStrongSecret = (value) => isNonEmpty(value) && value.trim().length >= 32;

const parseOrigins = (origins) =>
  origins
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);

const isValidUrl = (value) => {
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol);
  } catch (err) {
    return false;
  }
};

export const validateEnv = () => {
  const missing = REQUIRED_KEYS.filter((key) => !process.env[key]);

  if (missing.length) {
    const list = missing.join(", ");
    throw new Error(`Missing required environment variables: ${list}`);
  }

  if (!isStrongSecret(process.env.JWT_SECRET)) {
    throw new Error("JWT_SECRET must be at least 32 characters");
  }

  if (process.env.JWT_REFRESH_SECRET && !isStrongSecret(process.env.JWT_REFRESH_SECRET)) {
    throw new Error("JWT_REFRESH_SECRET must be at least 32 characters when provided");
  }

  const configuredOrigins = parseOrigins(process.env.CLIENT_URL || process.env.FRONTEND_URL || "");
  const defaultDevOrigin = "http://localhost:5173";
  const origins = configuredOrigins.length ? configuredOrigins : [defaultDevOrigin];

  if (!origins.every(isValidUrl)) {
    throw new Error("CLIENT_URL or FRONTEND_URL must contain valid http/https origins");
  }

  if (!configuredOrigins.length && process.env.NODE_ENV === "production") {
    throw new Error("CLIENT_URL or FRONTEND_URL is required in production");
  }

  if (process.env.FRONTEND_URL && !isValidUrl(process.env.FRONTEND_URL)) {
    throw new Error("FRONTEND_URL must be a valid http/https URL when provided");
  }

  if (process.env.COOKIE_DOMAIN && process.env.COOKIE_DOMAIN.includes("http")) {
    throw new Error("COOKIE_DOMAIN should be a bare domain, not a URL");
  }
};

export default validateEnv;
