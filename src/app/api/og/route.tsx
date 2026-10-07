import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { MARK } from "@/components/brand/mark";

// Brand fonts are read once at module scope; URLs relative to this file are traced into the bundle.
const [dmSerif, dmSerifItalic, hanken] = await Promise.all([
  readFile(new URL("../../../../assets/fonts/DMSerifDisplay-Regular.ttf", import.meta.url)),
  readFile(new URL("../../../../assets/fonts/DMSerifDisplay-Italic.ttf", import.meta.url)),
  readFile(new URL("../../../../assets/fonts/HankenGrotesk-500.ttf", import.meta.url)),
]);

/** Photo for the arch, fetched through the image optimizer as a small JPEG. Only local /images/ paths. */
async function loadPhoto(req: Request, photo: string | null) {
  if (!photo || !/^\/images\/[\w\-/]+\.jpg$/.test(photo)) return null;
  try {
    const url = new URL(`/_next/image?url=${encodeURIComponent(photo)}&w=828&q=60`, req.url);
    const res = await fetch(url, { headers: { Accept: "image/jpeg" } });
    if (!res.ok) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    return `data:${res.headers.get("content-type") ?? "image/jpeg"};base64,${buf.toString("base64")}`;
  } catch {
    return null;
  }
}

/** Branded 1200×630 share image: /api/og?title=…&eyebrow=…&locale=sr|en&photo=/images/… */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = (searchParams.get("title") ?? "Suton").slice(0, 110);
  const eyebrow = (searchParams.get("eyebrow") ?? "Savamala · Beograd").slice(0, 60);
  const sr = searchParams.get("locale") !== "en";
  const photo = await loadPhoto(req, searchParams.get("photo") ?? "/images/room/terrace-dusk.jpg");
  const size = title.length > 70 ? 50 : title.length > 42 ? 60 : 72;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundColor: "#0e0c0a",
          backgroundImage: "radial-gradient(circle at 78% 110%, rgba(110,31,42,0.75) 0%, rgba(110,31,42,0.2) 35%, rgba(14,12,10,0) 60%)",
          fontFamily: "Hanken",
          color: "#f1e7d6",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 700, padding: "64px 0 60px 72px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <svg width="58" height="58" viewBox="0 0 64 64">
              <path d={MARK.sun} fill="#e3a857" />
              {MARK.lines.map((l, i) => (
                <line key={i} x1={l.x1} x2={l.x2} y1={l.y} y2={l.y} stroke="#f1e7d6" strokeWidth="3" strokeLinecap="round" />
              ))}
            </svg>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontFamily: "DMSerif", fontSize: 34, letterSpacing: 9 }}>SUTON</div>
              <div style={{ fontSize: 13, letterSpacing: 5, color: "#b5a893" }}>{sr ? "KUHINJA & VINO" : "KITCHEN & WINE"}</div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            <div style={{ display: "flex", fontSize: 20, letterSpacing: 5, color: "#e3a857", textTransform: "uppercase" }}>{eyebrow}</div>
            <div style={{ display: "flex", fontFamily: "DMSerif", fontSize: size, lineHeight: 1.02, letterSpacing: -1.5 }}>{title}</div>
          </div>
          <div style={{ display: "flex", fontFamily: "DMSerifItalic", fontSize: 30, color: "#e3a857" }}>{sr ? "Vatra. Vino. Reka." : "Fire. Wine. River."}</div>
        </div>
        <div style={{ display: "flex", flex: 1, alignItems: "flex-end", justifyContent: "center", paddingBottom: 0 }}>
          <div
            style={{
              display: "flex",
              width: 400,
              height: 560,
              borderTopLeftRadius: 200,
              borderTopRightRadius: 200,
              overflow: "hidden",
              backgroundColor: "#1a1714",
            }}
          >
            {photo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photo} width={400} height={560} style={{ objectFit: "cover", width: 400, height: 560 }} alt="" />
            )}
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "DMSerif", data: dmSerif, weight: 400, style: "normal" },
        { name: "DMSerifItalic", data: dmSerifItalic, weight: 400, style: "italic" },
        { name: "Hanken", data: hanken, weight: 500, style: "normal" },
      ],
      headers: { "Cache-Control": "public, max-age=31536000, immutable" },
    },
  );
}
