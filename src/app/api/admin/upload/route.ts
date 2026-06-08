import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "EMPLOYEE")) {
    return NextResponse.json({ message: "Acesso negado." }, { status: 403 });
  }

  const token = session.accessToken;
  const formData = await req.formData();

  try {
    const res = await fetch(`${apiUrl}/admin/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Erro no proxy de upload:", error);
    return NextResponse.json({ message: "Erro ao enviar imagem para o backend." }, { status: 500 });
  }
}
