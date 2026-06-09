import { NextResponse } from "next/server";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  if (!code) {
    return NextResponse.json({ message: "Código inválido." }, { status: 400 });
  }

  try {
    const res = await fetch(`${apiUrl}/loyalty/public/coupon-details/${code}`, {
      cache: "no-store"
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Erro ao buscar detalhes públicos do cupom:", error);
    return NextResponse.json({ message: "Erro de conexão." }, { status: 500 });
  }
}
