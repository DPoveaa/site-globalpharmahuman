import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) {
    return NextResponse.json({ items: [], total: 0 });
  }

  try {
    const res = await fetch(`${apiUrl}/cart`, { 
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${session.accessToken}`
      }
    });
    
    if (!res.ok) {
      return NextResponse.json({ items: [], total: 0 });
    }

    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.error("API returned non-JSON response:", await res.text());
      return NextResponse.json({ items: [], total: 0 });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Erro no proxy de carrinho:", error);
    return NextResponse.json({ items: [], total: 0 });
  }
}
