import { Link } from 'wouter';
import { useLanguage } from '@/contexts/LanguageContext';
import { Language } from '@/lib/i18n';
import { ShoppingCart, Heart } from 'lucide-react';
import { Button } from './ui/button';

export function Header() {
  const { language, setLanguage, t } = useLanguage();

  const languageOptions: { value: Language; label: string }[] = [
    { value: 'sr-Cyrl', label: 'Ћирилица' },
    { value: 'sr-Latn', label: 'Latinica' },
    { value: 'en', label: 'English' },
  ];

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="container py-4">
        <div className="flex items-center justify-between">
          {/* Логотип и назив */}
          <Link href="/">
            <div className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity">
              <img 
                src="/logo.eps" 
                alt="Српска књига" 
                className="h-12 w-auto"
                onError={(e) => {
                  // Ако EPS не ради, сакриј слику
                  e.currentTarget.style.display = 'none';
                }}
              />
              <h1 className="text-3xl font-bold text-primary">
                Салон књиге
              </h1>
            </div>
          </Link>

          {/* Навигација */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/">
              <a className="text-foreground hover:text-primary transition-colors font-medium">
                {t.home}
              </a>
            </Link>
            <Link href="/books">
              <a className="text-foreground hover:text-primary transition-colors font-medium">
                {t.books}
              </a>
            </Link>
            <Link href="/authors">
              <a className="text-foreground hover:text-primary transition-colors font-medium">
                {t.authors}
              </a>
            </Link>
            <Link href="/editions">
              <a className="text-foreground hover:text-primary transition-colors font-medium">
                {t.editions}
              </a>
            </Link>
          </nav>

          {/* Језик, корпа и омиљено */}
          <div className="flex items-center gap-4">
            {/* Избор језика */}
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm font-medium cursor-pointer hover:border-primary transition-colors"
            >
              {languageOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {/* Омиљено */}
            <Link href="/favorites">
              <Button variant="ghost" size="icon" className="relative">
                <Heart className="h-5 w-5" />
                <span className="sr-only">{t.favorites}</span>
              </Button>
            </Link>

            {/* Корпа */}
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                <span className="sr-only">{t.cart}</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
