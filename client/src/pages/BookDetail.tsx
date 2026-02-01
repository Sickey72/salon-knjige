import { useRoute, Link } from 'wouter';
import { useLanguage } from '@/contexts/LanguageContext';
import { trpc } from '@/lib/trpc';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, ArrowLeft, Heart, ShoppingCart } from 'lucide-react';

export default function BookDetail() {
  const { t } = useLanguage();
  const [, params] = useRoute('/books/:id');
  const bookId = params?.id ? parseInt(params.id) : null;

  const { data, isLoading } = trpc.books.getById.useQuery(
    { id: bookId! },
    { enabled: !!bookId }
  );

  if (!bookId) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container py-12">
          <p className="text-center text-muted-foreground">
            Неисправан ID књиге
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container py-12">
        {/* Назад дугме */}
        <Link href="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t.home}
          </Button>
        </Link>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : data ? (
          <div className="grid md:grid-cols-2 gap-8">
            {/* Лева страна - Слика */}
            <div>
              <Card>
                <CardContent className="p-6">
                  <div className="aspect-[3/4] bg-muted rounded-md flex items-center justify-center">
                    {data.book.coverImageUrl ? (
                      <img
                        src={data.book.coverImageUrl}
                        alt={data.book.title}
                        className="w-full h-full object-cover rounded-md"
                      />
                    ) : (
                      <span className="text-muted-foreground">
                        Нема слике корице
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Десна страна - Детаљи */}
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">
                {data.book.title}
              </h1>
              {data.book.subtitle && (
                <p className="text-xl text-muted-foreground mb-4">
                  {data.book.subtitle}
                </p>
              )}

              {/* Аутор */}
              {data.author && (
                <div className="mb-4">
                  <span className="text-sm text-muted-foreground">{t.author}: </span>
                  <Link href={`/authors/${data.author.id}`}>
                    <span className="text-lg font-medium text-primary hover:underline cursor-pointer">
                      {data.author.fullName}
                    </span>
                  </Link>
                </div>
              )}

              {/* Едиција */}
              {data.edition && (
                <div className="mb-4">
                  <span className="text-sm text-muted-foreground">{t.edition}: </span>
                  <span className="text-lg font-medium text-accent">
                    {data.edition.name}
                  </span>
                </div>
              )}

              {/* ISBN */}
              {data.book.isbn && (
                <div className="mb-4">
                  <span className="text-sm text-muted-foreground">{t.isbn}: </span>
                  <span className="text-base font-mono">
                    {data.book.isbn}
                  </span>
                </div>
              )}

              {/* Тагови */}
              {data.tags && data.tags.length > 0 && (
                <div className="mb-6 flex flex-wrap gap-2">
                  {data.tags.filter(tag => tag !== null).map((tag) => (
                    <Badge key={tag!.id} variant="secondary">
                      {tag!.name}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Цена */}
              <div className="mb-6">
                {data.book.price ? (
                  <p className="text-3xl font-bold text-primary">
                    {data.book.price} РСД
                  </p>
                ) : (
                  <p className="text-lg text-muted-foreground">
                    Цена ће бити доступна ускоро
                  </p>
                )}
              </div>

              {/* Статус */}
              <div className="mb-6">
                {data.book.quantity > 5 ? (
                  <Badge variant="default" className="text-base px-4 py-2">
                    {t.inStock}
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="text-base px-4 py-2">
                    {t.outOfStock}
                  </Badge>
                )}
              </div>

              {/* Акције */}
              <div className="flex gap-4 mb-8">
                <Button size="lg" className="flex-1">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  {t.addToCart}
                </Button>
                <Button size="lg" variant="outline">
                  <Heart className="h-5 w-5 mr-2" />
                  {t.addToFavorites}
                </Button>
              </div>

              {/* Опис */}
              {data.book.description && (
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold mb-4">{t.description}</h2>
                    <p className="text-foreground whitespace-pre-wrap leading-relaxed">
                      {data.book.description}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">
              Књига није пронађена
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8">
        <div className="container">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2026 Салон књиге. Сва права задржана.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
