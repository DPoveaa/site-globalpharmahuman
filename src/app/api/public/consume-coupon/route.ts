import { NextResponse } from "next/server";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const res = await fetch(`${apiUrl}/loyalty/public/consume-coupon`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Erro ao consumir cupom publicamente:", error);
    return NextResponse.json({ message: "Erro de conexão." }, { status: 500 });
  }
}
