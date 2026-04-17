import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Linkedin, Mail, Youtube } from "lucide-react";
import { SITE_NAME } from "@/lib/constants";
import { whatsappLink } from "@/lib/utils";

const PAYMENT_METHODS = ["VISA", "Mastercard", "Elo", "Amex", "Pix"];
const SOCIAL_LINKS = [
  { href: "https://www.facebook.com", icon: Facebook, label: "Facebook" },
  { href: "https://www.youtube.com", icon: Youtube, label: "YouTube" },
  { href: "https://www.instagram.com", icon: Instagram, label: "Instagram" },
  { href: "https://www.linkedin.com", icon: Linkedin, label: "LinkedIn" }
];

export function Footer() {
  return (
    <footer className="mt-16 border-t border-brand-100 bg-[#f4f4f4]">
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="inline-block">
              <Image
                src="/gph_logo_extensa.png"
                alt={SITE_NAME}
                width={160}
                height={44}
                className="h-9 w-auto"
              />
            </Link>

            <Link
              href={whatsappLink(
                "Olá! Vim pelo site da Global Pharma Human e quero atendimento para vitaminas/manipulados."
              )}
              target="_blank"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-black px-5 py-3 text-sm font-semibold text-white"
            >
              <Mail size={16} />
              Fale conosco
            </Link>

            <div className="mt-5 flex items-center gap-2">
              {SOCIAL_LINKS.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    aria-label={item.label}
                    className="rounded-md border border-black/15 bg-white p-2 text-black transition hover:bg-black hover:text-white"
                  >
                    <Icon size={16} />
                  </Link>
                );
              })}
            </div>

            <div className="mt-6 border-t border-black/10 pt-4">
              <p className="text-sm font-semibold text-black">Formas de pagamento</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {PAYMENT_METHODS.map((method) => (
                  <span
                    key={method}
                    className="rounded-md border border-black/10 bg-white px-2 py-1 text-xs font-semibold text-black/70"
                  >
                    {method}
                  </span>
                ))}
              </div>
              <p className="mt-3 inline-block rounded-full bg-brand-100 px-3 py-1 text-[11px] font-semibold text-brand-800">
                PARCELE ATÉ 6X SEM JUROS | pedido mínimo de R$ 89,00
              </p>
            </div>
          </div>

          <div>
            <p className="text-sm font-bold text-black">Linha Global Pharma Human</p>
            <nav className="mt-3 flex flex-col gap-2 text-sm text-black/70">
              <Link href="/catalogo?q=vitamina" className="hover:text-black">
                Vitaminas e Suplementos
              </Link>
              <Link href="/catalogo?q=colageno" className="hover:text-black">
                Colágeno e Beleza
              </Link>
              <Link href="/catalogo?q=imunidade" className="hover:text-black">
                Imunidade
              </Link>
              <Link href="/catalogo?q=manipulado" className="hover:text-black">
                Fórmulas Manipuladas
              </Link>
              <Link href="/catalogo?q=energia" className="hover:text-black">
                Energia e Performance
              </Link>
            </nav>
          </div>

          <div>
            <p className="text-sm font-bold text-black">Atendimento</p>
            <nav className="mt-3 flex flex-col gap-2 text-sm text-black/70">
              <Link href="/conta" className="hover:text-black">
                Minha conta
              </Link>
              <Link href="/login" className="hover:text-black">
                Entrar
              </Link>
              <Link href="/carrinho" className="hover:text-black">
                Meu carrinho
              </Link>
              <Link href="/conta" className="hover:text-black">
                Meus pedidos
              </Link>
              <Link
                href={whatsappLink(
                  "Olá! Preciso de suporte da Global Pharma Human com meu pedido/troca."
                )}
                target="_blank"
                className="hover:text-black"
              >
                Trocas e devoluções
              </Link>
            </nav>
          </div>

          <div>
            <p className="text-sm font-bold text-black">Institucional</p>
            <nav className="mt-3 flex flex-col gap-2 text-sm text-black/70">
              <Link href="https://globalpharmahuman.far.br/" target="_blank" className="hover:text-black">
                Sobre a empresa
              </Link>
              <Link href="/cadastro" className="hover:text-black">
                Como criar conta
              </Link>
              <Link href="#" className="hover:text-black">
                Política de Privacidade
              </Link>
              <Link href="#" className="hover:text-black">
                Política de compras
              </Link>
              <Link href="#" className="hover:text-black">
                Formas de pagamento
              </Link>
            </nav>
          </div>
        </div>

        <div className="mt-10 border-t border-black/10 pt-6 text-xs text-black/60">
          <p>
            © {new Date().getFullYear()} {SITE_NAME}. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
