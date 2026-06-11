import crypto from "node:crypto";
import { put } from "@vercel/blob";
import { NextResponse, type NextRequest } from "next/server";
import sharp from "sharp";

/**
 * POST /api/admin/upload-photo — multipart/form-data with a single `file` field.
 *
 * Pipeline (per spec):
 *   1. Reject anything over 20 MB on the way in.
 *   2. Strip ALL metadata (privacy: nukes EXIF GPS + camera info).
 *   3. Auto-rotate based on EXIF orientation (fixes iPhone-portrait-upside-down).
 *   4. Resize down to fit inside 1600×1200, preserve aspect, no upscale.
 *   5. Generate JPG (mozjpeg encoder if available, q90) AND WebP (q85), both at the
 *      same UUID, both stored in Vercel Blob under /specials/.
 *
 * Sharp accepts HEIC/HEIF/JPG/PNG/WebP input formats on Vercel's Node 20+ runtime
 * (libvips on those images ships with HEIC support). Returns `{ jpgUrl, webpUrl,
 * width, height }`.
 *
 * Runs on the Node runtime because sharp is a native module — not Edge-compatible.
 */
export const runtime = "nodejs";

// 20 MB upload ceiling.
const MAX_BYTES = 20 * 1024 * 1024;
const MAX_W = 1600;
const MAX_H = 1200;

export async function POST(req: NextRequest) {
  // Defense in depth: middleware gates the route, but check size before parsing the body.
  const contentLength = Number(req.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BYTES) {
    return NextResponse.json(
      { error: "Photo exceeds 20 MB limit" },
      { status: 413 }
    );
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json(
      { error: "Could not read upload" },
      { status: 400 }
    );
  }
  const file = formData.get("file");
  if (!(file instanceof Blob)) {
    return NextResponse.json(
      { error: "Missing `file` field" },
      { status: 400 }
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "Photo exceeds 20 MB limit" },
      { status: 413 }
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  // Sharp pipeline. Start from the raw upload, apply rotate (uses EXIF orientation
  // metadata) then strip everything else, then resize. The order matters: rotate must
  // see the EXIF before metadata is removed.
  let pipeline: sharp.Sharp;
  try {
    pipeline = sharp(buffer, { failOn: "error" })
      .rotate() // auto-orient using EXIF
      .withMetadata({}) // override with empty metadata → strips EXIF/IPTC/XMP
      .resize({
        width: MAX_W,
        height: MAX_H,
        fit: "inside",
        withoutEnlargement: true,
      });
  } catch (e) {
    console.error("Sharp init failed:", e);
    return NextResponse.json(
      { error: "Couldn't read image" },
      { status: 400 }
    );
  }

  const id = crypto.randomUUID();
  const jpgPath = `specials/${id}.jpg`;
  const webpPath = `specials/${id}.webp`;

  try {
    // Branch the pipeline into two encoded outputs.
    const [jpgBuffer, webpBuffer, meta] = await Promise.all([
      pipeline.clone().jpeg({ quality: 90, mozjpeg: true }).toBuffer(),
      pipeline.clone().webp({ quality: 85 }).toBuffer(),
      pipeline.clone().metadata(),
    ]);

    const [jpgBlob, webpBlob] = await Promise.all([
      put(jpgPath, jpgBuffer, {
        access: "public",
        contentType: "image/jpeg",
        addRandomSuffix: false,
      }),
      put(webpPath, webpBuffer, {
        access: "public",
        contentType: "image/webp",
        addRandomSuffix: false,
      }),
    ]);

    return NextResponse.json({
      jpgUrl: jpgBlob.url,
      webpUrl: webpBlob.url,
      width: meta.width ?? 0,
      height: meta.height ?? 0,
    });
  } catch (e) {
    console.error("Photo pipeline failed:", e);
    return NextResponse.json(
      { error: "Photo processing failed" },
      { status: 500 }
    );
  }
}
