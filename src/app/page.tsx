import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white selection:bg-blue-500 selection:text-white">
      <section className="relative flex flex-col items-center justify-center py-32 px-4 text-center overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] -z-10"></div>
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[100px] -z-10"></div>

        <div className="animate-fade-in-up">
          <span className="inline-block py-1 px-3 rounded-full bg-blue-900/50 border border-blue-700 text-blue-300 text-sm font-bold mb-6 tracking-wide">
            NOWOCZESNE CENTRUM FITNESS
          </span>
          <h1 className="text-6xl md:text-8xl font-display text-white mb-6 tracking-wide">
            TRENUJ{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              LEPIEJ
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto font-light mb-10 leading-relaxed">
            Dołącz do społeczności, która nie boi się wyzwań. Zarządzaj swoim
            karnetem, zapisuj się na zajęcia online i śledź swoje postępy.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition transform hover:scale-105 shadow-lg shadow-blue-900/50 text-lg"
            >
              Rozpocznij Teraz
            </Link>
            <Link
              href="/activities"
              className="px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-lg border border-gray-700 transition hover:border-gray-500 text-lg"
            >
              Sprawdź Grafik
            </Link>
          </div>
        </div>
      </section>

      <section className="py-10 border-y border-gray-800 bg-gray-900/50">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <h3 className="text-4xl font-display text-white">24/7</h3>
            <p className="text-gray-500 text-sm uppercase tracking-widest mt-1">
              Dostęp
            </p>
          </div>
          <div>
            <h3 className="text-4xl font-display text-white">15+</h3>
            <p className="text-gray-500 text-sm uppercase tracking-widest mt-1">
              Trenerów
            </p>
          </div>
          <div>
            <h3 className="text-4xl font-display text-white">50+</h3>
            <p className="text-gray-500 text-sm uppercase tracking-widest mt-1">
              Maszyn
            </p>
          </div>
          <div>
            <h3 className="text-4xl font-display text-white">100%</h3>
            <p className="text-gray-500 text-sm uppercase tracking-widest mt-1">
              Satysfakcji
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 px-4 bg-gray-800/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display mb-4">
              Wszystko w jednej aplikacji
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Nie marnuj czasu w recepcji. Nasz system online pozwala Ci
              załatwić wszystko z poziomu telefonu.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700 hover:border-blue-500 transition group">
              <div className="w-12 h-12 bg-blue-900/50 rounded-lg flex items-center justify-center mb-6 group-hover:bg-blue-600 transition">
                📅
              </div>
              <h3 className="text-xl font-bold mb-3">Zapisy Online</h3>
              <p className="text-gray-400 leading-relaxed">
                Rezerwuj miejsce na Jodze, Crossficie czy Zumbie jednym
                kliknięciem. Widzisz licznik miejsc w czasie rzeczywistym.
              </p>
            </div>

            <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700 hover:border-purple-500 transition group">
              <div className="w-12 h-12 bg-purple-900/50 rounded-lg flex items-center justify-center mb-6 group-hover:bg-purple-600 transition">
                💳
              </div>
              <h3 className="text-xl font-bold mb-3">E-Karnety</h3>
              <p className="text-gray-400 leading-relaxed">
                Kupuj i przedłużaj karnety bez kolejek. Twój status członkostwa
                aktualizuje się natychmiastowo.
              </p>
            </div>

            <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700 hover:border-green-500 transition group">
              <div className="w-12 h-12 bg-green-900/50 rounded-lg flex items-center justify-center mb-6 group-hover:bg-green-600 transition">
                📊
              </div>
              <h3 className="text-xl font-bold mb-3">Pełna Kontrola</h3>
              <p className="text-gray-400 leading-relaxed">
                Sprawdzaj historię swoich wejść, zarządzaj rezerwacjami i
                odwołuj zajęcia, jeśli zmienią Ci się plany.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-4 text-center">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-blue-800/30 rounded-3xl p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px] -z-10"></div>

          <h2 className="text-4xl md:text-5xl font-display mb-6">
            Gotowy na trening?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Załóż konto w mniej niż minutę i odbierz dostęp do najlepszego
            sprzętu w mieście.
          </p>
          <Link
            href="/register"
            className="inline-block px-10 py-4 bg-white text-blue-900 font-bold rounded-lg hover:bg-gray-200 transition text-lg"
          >
            Dołącz teraz
          </Link>
        </div>
      </section>

      <footer className="py-8 border-t border-gray-800 text-center text-gray-500 text-sm">
        <p>
          &copy; {new Date().getFullYear()} Gym Manager. Projekt studencki JWP
          21273 Mierzwa.
        </p>
      </footer>
    </div>
  );
}
