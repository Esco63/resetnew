// src/components/layout/Footer.tsx
import Container from "@/components/ui/Container";
import Link from "@/components/ui/Link";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-white to-slate-50 mt-16">
      <Container className="py-12 grid md:grid-cols-4 gap-8">
        <div>
          <div className="text-2xl font-black tracking-tight">
            <span className="text-slate-900">re</span>
            <span className="text-orange-600">set.</span>
          </div>
          <p className="mt-3 text-slate-600 leading-relaxed">
            Auflösen · Entrümpeln · Neuanfangen – in Schwerin & Umgebung.
          </p>
        </div>

        <div>
          <h4 className="font-bold">Leistungen</h4>
          <ul className="mt-3 space-y-2 text-slate-600">
            <li>Haushaltsauflösung</li>
            <li>Entrümpelung</li>
            <li>Umzug mit Fahrer</li>
            <li>Fahrzeugvermietung</li>
            <li>Gebäudereinigung</li>
            <li>Hausmeisterservice</li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold">Gebiete</h4>
          <ul className="mt-3 space-y-2 text-slate-600">
            <li>Innenstadt · Altstadt · Schelfstadt</li>
            <li>Paulsstadt · Werdervorstadt</li>
            <li>Lankow · Krebsförden · Neumühle</li>
            <li>Zippendorf · Mueß · Görries</li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold">Rechtliches</h4>
          <ul className="mt-3 space-y-2 text-slate-600">
            <li><Link href="/rechtliches" variant="link">Impressum</Link></li>
            <li><Link href="/rechtliches" variant="link">Datenschutzerklärung</Link></li>
            <li><Link href="/rechtliches" variant="link">AGB</Link></li>
          </ul>
        </div>
      </Container>

      <Container className="pb-10">
        <div className="rounded-2xl bg-white/70 ring-1 ring-slate-200/60 shadow-sm p-4 md:p-5 flex flex-wrap items-center justify-between gap-3">
          <span className="text-sm text-slate-600">
            © {new Date().getFullYear()} reset. Alle Rechte vorbehalten.
          </span>
          <span className="flex items-center gap-3 text-sm text-slate-600">
            Made with ❤️ in Schwerin
            <Link
              href="/admin/preise"
              className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 hover:border-orange-200 hover:text-orange-600"
            >
              Admin Login
            </Link>
          </span>
        </div>
      </Container>
    </footer>
  );
}
