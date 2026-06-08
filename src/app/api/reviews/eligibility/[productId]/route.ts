import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export async function GET(_req: Request, { params }: { params: Promise<{ productId: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: "Acesso negado." }, { status: 403 });
  }

  try {
    const { productId } = await params;
    const res = await fetch(`${apiUrl}/reviews/eligibility/${productId}`, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`
      },
      cache: "no-store"
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ message: "Erro no servidor backend." }, { status: 500 });
  }
}
