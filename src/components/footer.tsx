import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Linkedin, MessageCircle, ChevronDown } from "lucide-react";
import { SITE_NAME } from "@/lib/constants";
import { whatsappLink } from "@/lib/utils";

const SOCIAL_LINKS = [
  { href: "https://www.facebook.com/globalhumanmanipulacao", icon: Facebook, label: "Facebook" },
  { href: "https://www.instagram.com/globalpharmahuman/", icon: Instagram, label: "Instagram" },
  { href: whatsappLink("Olá! Vim pelo site e gostaria de mais informações."), icon: MessageCircle, label: "WhatsApp" },
  { href: "https://www.linkedin.com", icon: Linkedin, label: "LinkedIn" }
];

function FooterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="col-span-1">
      {/* Desktop view */}
      <div className="hidden lg:block">
        <p className="text-sm font-bold text-black">{title}</p>
        <div className="mt-3 flex flex-col gap-2 text-sm text-black/70">
          {children}
        </div>
      </div>

      {/* Mobile view (Accordion) */}
      <div className="lg:hidden">
        <details className="group [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex cursor-pointer items-center justify-between border-b border-black/10 py-3 text-sm font-bold text-black outline-none">
            {title}
            <ChevronDown size={16} className="transition-transform group-open:rotate-180" />
          </summary>
          <div className="mt-3 flex flex-col gap-2 pb-3 text-sm text-black/70">
            {children}
          </div>
        </details>
      </div>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="mt-12 border-t border-brand-100 bg-[#f8f8f8]">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        <div className="grid grid-cols-1 gap-x-4 gap-y-0 lg:grid-cols-[1.2fr_1fr_1fr_1fr] lg:gap-y-8">
          <div className="col-span-1 py-6 lg:py-0">
            <Link href="/" className="inline-block">
              <Image
                src="/gph_logo_extensa.png"
                alt={SITE_NAME}
                width={160}
                height={44}
                className="h-9 w-auto"
                unoptimized
              />
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
          </div>

          <FooterSection title="Linha Global Pharma Human">
            <Link href="/catalogo?q=vitamina" className="hover:text-black">
              Vitaminas e Suplementos
            </Link>
            <Link href="/catalogo?q=colageno" className="hover:text-black">
              Colágeno e Beleza
            </Link>
            <Link href="/catalogo?q=imunidade" className="hover:text-black">
              Imunidade
            </Link>
            <Link href="https://api.whatsapp.com/send/?phone=5511949209864&text=Ol%C3%A1%21+Vim+pelo+site+da+Global+Pharma+Human+e+queria+saber+mais+sobre+as+f%C3%B3rmulas+manipuladas.&type=phone_number&app_absent=0" className="hover:text-black">
              Fórmulas Manipuladas
            </Link>
            <Link href="/catalogo?q=energia" className="hover:text-black">
              Energia e Performance
            </Link>
          </FooterSection>

          <FooterSection title="Atendimento">
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
                "Olá! Preciso de suporte da Global Pharma Human com meu pedido."
              )}
              target="_blank"
              className="hover:text-black"
            >
              Trocas e devoluções
            </Link>
          </FooterSection>

          <FooterSection title="Institucional">
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
          </FooterSection>
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
