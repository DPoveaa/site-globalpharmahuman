import { NextResponse } from "next/server";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export async function GET(req: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  try {
    const res = await fetch(`${apiUrl}/orders/share/${token}`, {
      cache: "no-store"
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("[Next.js Public API Orders Share] Error fetching shared order:", error);
    return NextResponse.json({ message: "Erro no servidor backend." }, { status: 500 });
  }
}
