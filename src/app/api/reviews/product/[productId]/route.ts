import { NextResponse } from "next/server";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export async function GET(_req: Request, { params }: { params: Promise<{ productId: string }> }) {
  try {
    const { productId } = await params;
    const res = await fetch(`${apiUrl}/reviews/product/${productId}`, { cache: "no-store" });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ message: "Erro no servidor backend." }, { status: 500 });
  }
}
