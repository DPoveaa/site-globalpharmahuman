import { NextResponse } from "next/server";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const zipCode = searchParams.get("zipCode");

  if (!zipCode) {
    return NextResponse.json({ message: "CEP obrigatório" }, { status: 400 });
  }

  try {
    const res = await fetch(`${apiUrl}/shipping/calculate?zipCode=${zipCode}`, {
      cache: "no-store"
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ message: "Erro no servidor backend." }, { status: 500 });
  }
}
