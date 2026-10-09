import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description: "Qué datos trata CineLingo, para qué y cómo ejercer tus derechos.",
};

// BORRADOR: revisar con asesoría legal antes de publicar (responsable, contacto y encargados reales).
export default function PrivacyPage() {
  return (
    <article className="space-y-6 leading-relaxed">
      <h1 className="font-serif text-3xl">Política de privacidad</h1>
      <p className="text-sm text-muted">Borrador · última actualización: 8 de octubre de 2026</p>

      <section>
        <h2 className="text-lg font-semibold">Qué datos tratamos</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Tu email, para enviarte el código de acceso e identificar tu cuenta.</li>
          <li>Tus passkeys (solo la clave pública; la privada nunca sale de tu dispositivo).</li>
          <li>Tu progreso de aprendizaje y preferencias (nivel objetivo y zona horaria).</li>
        </ul>
        <p className="mt-2">
          No tratamos datos de pago, ubicación ni contactos. Las grabaciones de voz del modo
          shadowing se procesan solo en tu dispositivo y nunca se envían a nuestros servidores.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">Para qué y con qué base legal</h2>
        <p className="mt-2">
          Para prestarte el servicio que solicitas (art. 6.1.b RGPD) y para mantener la seguridad de
          la plataforma, por ejemplo limitando intentos de acceso abusivos (art. 6.1.f). Para
          limitar intentos no guardamos tu IP ni tu email: solo una huella cifrada que se borra en
          24 horas.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">Cookies</h2>
        <p className="mt-2">
          Solo usamos una cookie técnica imprescindible para mantener tu sesión. No hay cookies de
          terceros, publicidad ni analítica, por eso no mostramos un banner de consentimiento.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">Dónde se guardan</h2>
        <p className="mt-2">
          En servidores de la Unión Europea (Supabase, región Frankfurt). La aplicación se sirve a
          través de Vercel.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">Tus derechos</h2>
        <p className="mt-2">
          Desde Ajustes puedes descargar todos tus datos y borrar tu cuenta de forma inmediata.
          También puedes ejercer tus derechos de acceso, rectificación, oposición y limitación, y
          reclamar ante la Agencia Española de Protección de Datos (aepd.es).
        </p>
      </section>
    </article>
  );
}
