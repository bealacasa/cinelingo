import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Icono de "Añadir a pantalla de inicio" en iOS (PNG generado en el build, sin marcas de terceros). */
export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#a83d0c",
        color: "#ffffff",
        fontSize: 150,
        fontFamily: "Georgia, serif",
        paddingTop: 60,
      }}
    >
      “
    </div>,
    size,
  );
}
