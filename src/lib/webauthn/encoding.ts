/** Conversión base64url ↔ bytes para WebAuthn (sin criptografía: solo codificación). */

export function base64urlToBuffer(value: string): ArrayBuffer {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

export function bufferToBase64url(buffer: ArrayBuffer | ArrayBufferView): string {
  const bytes =
    buffer instanceof ArrayBuffer
      ? new Uint8Array(buffer)
      : new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/** Opciones JSON del servidor → opciones binarias para navigator.credentials.get(). */
export function parseRequestOptions(
  json: PublicKeyCredentialRequestOptionsJSON,
): PublicKeyCredentialRequestOptions {
  return {
    ...json,
    challenge: base64urlToBuffer(json.challenge),
    allowCredentials: json.allowCredentials?.map((c) => ({ ...c, id: base64urlToBuffer(c.id) })),
  } as PublicKeyCredentialRequestOptions;
}

/** Opciones JSON del servidor → opciones binarias para navigator.credentials.create(). */
export function parseCreationOptions(
  json: PublicKeyCredentialCreationOptionsJSON,
): PublicKeyCredentialCreationOptions {
  return {
    ...json,
    challenge: base64urlToBuffer(json.challenge),
    user: { ...json.user, id: base64urlToBuffer(json.user.id) },
    excludeCredentials: json.excludeCredentials?.map((c) => ({
      ...c,
      id: base64urlToBuffer(c.id),
    })),
  } as PublicKeyCredentialCreationOptions;
}

/** Credencial del navegador → JSON serializable para el servidor. */
export function credentialToJSON(credential: PublicKeyCredential): Record<string, unknown> {
  const response = credential.response;
  const out: Record<string, unknown> = {};
  for (const key of [
    "clientDataJSON",
    "authenticatorData",
    "signature",
    "userHandle",
    "attestationObject",
  ] as const) {
    const value = (response as unknown as Record<string, ArrayBuffer | null | undefined>)[key];
    if (value) out[key] = bufferToBase64url(value);
  }
  if ("getTransports" in response && typeof response.getTransports === "function") {
    out.transports = (response as AuthenticatorAttestationResponse).getTransports();
  }
  return {
    id: credential.id,
    rawId: bufferToBase64url(credential.rawId),
    type: credential.type,
    authenticatorAttachment: credential.authenticatorAttachment ?? null,
    clientExtensionResults: credential.getClientExtensionResults(),
    response: out,
  };
}
