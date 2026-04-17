import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ items: [], total: 0 });
  }

  try {
    // No backend real, passaríamos o userId ou token. 
    // Como o backend está no mesmo servidor, podemos passar o userId na query ou header
    const res = await fetch(`${apiUrl}/cart?userId=${session.user.id}`, { cache: "no-store" });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ items: [], total: 0 });
  }
}
