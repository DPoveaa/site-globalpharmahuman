import { NextResponse } from "next/server";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export async function GET() {
  try {
    const res = await fetch(`${apiUrl}/units`, {
      next: { tags: ["units"], revalidate: 300 }
    });
    return NextResponse.json(await res.json(), { status: res.status });
  } catch {
    return NextResponse.json({ message: "Erro de conexão." }, { status: 500 });
  }
}
