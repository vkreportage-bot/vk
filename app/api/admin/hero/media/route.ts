import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { validateHeroFileBasics } from "@/lib/hero-upload-rules";
import { saveMediaLocally } from "@/lib/media-storage";

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (process.env.MEDIA_STORAGE !== "local" || process.env.VERCEL) {
    return NextResponse.json(
      { error: "Cet endpoint est réservé au stockage local de développement." },
      { status: 400 }
    );
  }

  try {
    const form = await request.formData();
    const file = form.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Fichier manquant." }, { status: 400 });
    }

    const validationError = validateHeroFileBasics({
      type: file.type,
      size: file.size
    });

    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const url = await saveMediaLocally(file);
    return NextResponse.json({ url });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Erreur pendant l’upload."
      },
      { status: 400 }
    );
  }
}
