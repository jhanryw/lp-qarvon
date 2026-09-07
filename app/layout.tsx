import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";

const FALLBACK_SITE_URL = "https://qarvon.com.br";
const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

// Guards build-time metadata generation against a malformed optional env
// var (e.g. NEXT_PUBLIC_SITE_URL set without a protocol) — an invalid
// `new URL()` here would otherwise throw while Next collects page data.
function resolveSiteUrl(): URL {
  try {
    return new URL(process.env.NEXT_PUBLIC_SITE_URL || FALLBACK_SITE_URL);
  } catch {
    return new URL(FALLBACK_SITE_URL);
  }
}

const SITE_URL = resolveSiteUrl();

// viewportFit: "cover" é o que faz env(safe-area-inset-bottom) deixar de
// ser sempre 0 — sem isso o navegador já reserva a safe area sozinho e o
// padding-bottom condicional do LeadFormModal seria um no-op inofensivo,
// mas também nunca protegeria o CTA numa página que decida ocupar a tela
// inteira. Não afeta layout de quem não usa env(safe-area-inset-*).
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: SITE_URL,
  title: "Qarvon — Assessoria de crescimento para varejo",
  description:
    "A Qarvon identifica onde sua operação de varejo perde vendas e corrige os gargalos antes de escalar o investimento em mídia.",
  openGraph: {
    title: "Qarvon — Assessoria de crescimento para varejo",
    description:
      "Aumente as vendas da sua loja sem investir mais em tráfego pago. Método QARVON: qualificação, análise, reestruturação, validação, otimização e nova escala.",
    url: SITE_URL,
    siteName: "Qarvon",
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-bg text-fg">
        {children}

        {PIXEL_ID ? (
          <Script id="meta-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window,document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${PIXEL_ID}');
              fbq('track', 'PageView');
            `}
          </Script>
        ) : null}
      </body>
    </html>
  );
}
