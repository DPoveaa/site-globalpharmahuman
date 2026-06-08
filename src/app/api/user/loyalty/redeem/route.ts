import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: "Acesso negado." }, { status: 401 });
  }

  const token = session.accessToken;
  const { searchParams } = new URL(req.url);
  const rewardId = searchParams.get("rewardId");

  try {
    const res = await fetch(`${apiUrl}/loyalty/user/redeem/${rewardId}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ message: "Erro de conexão." }, { status: 500 });
  }
}
