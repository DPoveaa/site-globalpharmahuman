import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "EMPLOYEE")) {
    return NextResponse.json({ message: "Acesso negado." }, { status: 403 });
  }

  const token = session.accessToken;

  try {
    const res = await fetch(`${apiUrl}/admin/promotions`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      cache: "no-store"
    });
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error(`[API Proxy GET] Backend returned error: ${res.status}`, errorData);
      return NextResponse.json({ 
        message: "Erro ao buscar promoções no backend.",
        status: res.status,
        details: errorData
      }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("[API Proxy GET] Fetch error:", error);
    return NextResponse.json({ message: "Erro de conexão com o backend." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "EMPLOYEE")) {
    return NextResponse.json({ message: "Acesso negado." }, { status: 403 });
  }

  const token = session.accessToken;
  const body = await req.json();

  try {
    const res = await fetch(`${apiUrl}/admin/promotions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ message: "Erro no servidor backend." }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "EMPLOYEE")) {
    return NextResponse.json({ message: "Acesso negado." }, { status: 403 });
  }

  const token = session.accessToken;
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const body = await req.json();

  try {
    const res = await fetch(`${apiUrl}/admin/promotions/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ message: "Erro no servidor backend." }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "EMPLOYEE")) {
    return NextResponse.json({ message: "Acesso negado." }, { status: 403 });
  }

  const token = session.accessToken;
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  try {
    const res = await fetch(`${apiUrl}/admin/promotions/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ message: "Erro no servidor backend." }, { status: 500 });
  }
}
