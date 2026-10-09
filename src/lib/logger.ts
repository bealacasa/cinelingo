type Level = "info" | "warn" | "error";
type Fields = Record<string, unknown>;

const SENSITIVE_KEY =
  /pass|token|secret|authorization|cookie|email|^ip$|session|credential|code_?verifier/i;
const EMAIL = /[^\s@"'<>]+@[^\s@"'<>]+\.[^\s@"'<>]+/g;
const JWT = /eyJ[\w-]+\.[\w-]+\.[\w-]+/g;

/** Elimina datos personales y secretos antes de escribir en los logs. */
export function redact(value: unknown, depth = 0): unknown {
  if (depth > 4) return "[depth]";
  if (typeof value === "string") {
    return value.replace(EMAIL, "[email]").replace(JWT, "[jwt]").slice(0, 500);
  }
  if (Array.isArray(value)) return value.slice(0, 20).map((item) => redact(item, depth + 1));
  if (value instanceof Error)
    return { name: value.name, message: redact(value.message, depth + 1) };
  if (value && typeof value === "object") {
    const out: Fields = {};
    for (const [key, inner] of Object.entries(value)) {
      out[key] = SENSITIVE_KEY.test(key) ? "[redacted]" : redact(inner, depth + 1);
    }
    return out;
  }
  return value;
}

function write(level: Level, event: string, fields: Fields = {}) {
  const line = JSON.stringify({
    level,
    event,
    time: new Date().toISOString(),
    ...(redact(fields) as Fields),
  });
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.info(line);
}

/** Logger estructurado. Pasa códigos y eventos, nunca emails, tokens ni cuerpos de petición. */
export const logger = {
  info: (event: string, fields?: Fields) => write("info", event, fields),
  warn: (event: string, fields?: Fields) => write("warn", event, fields),
  error: (event: string, fields?: Fields) => write("error", event, fields),
};
