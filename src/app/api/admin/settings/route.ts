import { NextResponse } from "next/server";
import { ensureAdmin } from "@/lib/auth-utils";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export async function GET() {
  const admin = await ensureAdmin();
  if (!admin) return NextResponse.json({ message: "Acesso negado." }, { status: 403 });

  try {
    const res = await fetch(`${apiUrl}/admin/settings`, { cache: "no-store" });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ message: "Erro no servidor backend." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const admin = await ensureAdmin();
  if (!admin) return NextResponse.json({ message: "Acesso negado." }, { status: 403 });

  const body = await req.json();

  try {
    const res = await fetch(`${apiUrl}/admin/settings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ message: "Erro no servidor backend." }, { status: 500 });
  }
}
