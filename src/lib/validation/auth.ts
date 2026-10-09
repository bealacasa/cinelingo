import { z } from "zod";

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .max(254)
  .pipe(z.email({ message: "Escribe un email válido." }));

export const otpSchema = z
  .string()
  .trim()
  .regex(/^\d{6,10}$/, { message: "El código tiene entre 6 y 10 dígitos." });

export const tokenHashSchema = z
  .string()
  .min(10)
  .max(512)
  .regex(/^[A-Za-z0-9_-]+$/);

export const otpTypeSchema = z.enum(["email", "magiclink", "signup"]);

/** Credencial WebAuthn serializada (formato JSON del W3C). Supabase verifica la criptografía. */
const b64url = z
  .string()
  .max(16_384)
  .regex(/^[A-Za-z0-9_-]*$/);
export const webauthnCredentialSchema = z.object({
  id: b64url.min(1),
  rawId: b64url.min(1),
  type: z.literal("public-key"),
  authenticatorAttachment: z.enum(["platform", "cross-platform"]).nullish(),
  clientExtensionResults: z.record(z.string(), z.unknown()).default({}),
  response: z.record(
    z.string(),
    z.union([b64url, z.array(z.string().max(32)), z.number(), z.null()]),
  ),
});

export const challengeIdSchema = z
  .string()
  .min(1)
  .max(128)
  .regex(/^[A-Za-z0-9_-]+$/);
