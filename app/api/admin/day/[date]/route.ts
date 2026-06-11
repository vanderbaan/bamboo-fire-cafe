import { revalidatePath } from "next/cache";
import { del } from "@vercel/blob";
import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySession } from "@/lib/admin/auth";
import { isValidDateString, nowIsoNY } from "@/lib/admin/dates";
import { deleteDay, getDay, setDay } from "@/lib/admin/kv";
import type { DayRecord, UpsertDayBody } from "@/lib/admin/types";

/**
 * /api/admin/day/[date] — GET / POST / DELETE for a single day's special.
 *
 * Auth: middleware gates everything under /api/admin. We re-read the session here only
 * to capture the editor identity for the `updatedBy` audit field.
 *
 * Cache: every POST and DELETE revalidates the homepage and the /menu route so the
 * public `TodaysSpecial` card and the schema MenuSection pick up the change right away.
 */

interface RouteCtx {
  params: { date: string };
}

async function readSession() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  return token ? await verifySession(token) : null;
}

function badDate() {
  return NextResponse.json(
    { error: "Invalid date — expected YYYY-MM-DD" },
    { status: 400 }
  );
}

export async function GET(_req: NextRequest, { params }: RouteCtx) {
  if (!isValidDateString(params.date)) return badDate();
  const record = await getDay(params.date);
  return NextResponse.json({ record });
}

export async function POST(req: NextRequest, { params }: RouteCtx) {
  if (!isValidDateString(params.date)) return badDate();
  const session = await readSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: UpsertDayBody;
  try {
    body = (await req.json()) as UpsertDayBody;
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  if (!Array.isArray(body.items) || body.items.length === 0) {
    return NextResponse.json(
      { error: "At least one item required" },
      { status: 400 }
    );
  }
  const validItems = body.items.filter(
    (i) => typeof i.name === "string" && i.name.trim().length > 0
  );
  if (validItems.length === 0) {
    return NextResponse.json(
      { error: "At least one item with a name is required" },
      { status: 400 }
    );
  }

  // If the previous record had a photo and the new record either has no photo or a
  // different photo, delete the old Blob files. Prevents orphan accumulation.
  const prev = await getDay(params.date);
  if (prev?.photo) {
    const newPhoto = body.photo;
    const photoChanged =
      !newPhoto ||
      newPhoto.jpgUrl !== prev.photo.jpgUrl ||
      newPhoto.webpUrl !== prev.photo.webpUrl;
    if (photoChanged) {
      // Don't fail the save if blob cleanup fails — log and continue.
      try {
        await del([prev.photo.jpgUrl, prev.photo.webpUrl]);
      } catch (e) {
        console.error("Blob cleanup on photo change failed:", e);
      }
    }
  }

  const record: DayRecord = {
    date: params.date,
    items: validItems.map((i) => ({
      name: i.name.trim(),
      price: typeof i.price === "string" ? i.price.trim() : "",
      soldOut: !!i.soldOut,
    })),
    description:
      typeof body.description === "string" && body.description.trim().length > 0
        ? body.description.trim()
        : null,
    photo: body.photo ?? null,
    active: body.active !== false, // default true
    updatedAt: nowIsoNY(),
    updatedBy: session.username,
  };

  await setDay(record);
  revalidatePath("/");
  revalidatePath("/menu");
  return NextResponse.json({ ok: true, record });
}

export async function DELETE(_req: NextRequest, { params }: RouteCtx) {
  if (!isValidDateString(params.date)) return badDate();

  // Pull the existing record so we can clean up its blob files.
  const existing = await getDay(params.date);
  if (existing?.photo) {
    try {
      await del([existing.photo.jpgUrl, existing.photo.webpUrl]);
    } catch (e) {
      console.error("Blob cleanup on day delete failed:", e);
    }
  }
  await deleteDay(params.date);
  revalidatePath("/");
  revalidatePath("/menu");
  return NextResponse.json({ ok: true });
}

export const runtime = "nodejs";
