import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidateTag } from "next/cache";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "EMPLOYEE")) {
    return NextResponse.json({ message: "Acesso negado." }, { status: 403 });
  }

  try {
    const res = await fetch(`${apiUrl}/units/admin`, {
      headers: { Authorization: `Bearer ${session.accessToken}` },
      cache: "no-store"
    });
    return NextResponse.json(await res.json(), { status: res.status });
  } catch {
    return NextResponse.json({ message: "Erro de conexão." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "EMPLOYEE")) {
    return NextResponse.json({ message: "Acesso negado." }, { status: 403 });
  }

  try {
    const body = await req.json();
    const res = await fetch(`${apiUrl}/units/admin`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}` 
      },
      body: JSON.stringify(body)
    });
    if (res.ok) revalidateTag("units");
    return NextResponse.json(await res.json(), { status: res.status });
  } catch {
    return NextResponse.json({ message: "Erro de conexão." }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "EMPLOYEE")) {
    return NextResponse.json({ message: "Acesso negado." }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const body = await req.json();
    
    const res = await fetch(`${apiUrl}/units/admin/${id}`, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}` 
      },
      body: JSON.stringify(body)
    });
    if (res.ok) revalidateTag("units");
    return NextResponse.json(await res.json(), { status: res.status });
  } catch {
    return NextResponse.json({ message: "Erro de conexão." }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "EMPLOYEE")) {
    return NextResponse.json({ message: "Acesso negado." }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    
    const res = await fetch(`${apiUrl}/units/admin/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${session.accessToken}` }
    });
    if (res.ok) revalidateTag("units");
    return NextResponse.json(await res.json(), { status: res.status });
  } catch {
    return NextResponse.json({ message: "Erro de conexão." }, { status: 500 });
  }
}
