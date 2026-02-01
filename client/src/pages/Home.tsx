import { useState } from 'react';
import { Link } from 'wouter';
import { useLanguage } from '@/contexts/LanguageContext';
import { trpc } from '@/lib/trpc';
import { Header } from '@/components/Header';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Search, Heart, ShoppingCart } from 'lucide-react';

export default function Home() {
  const { t } = useLanguage();
  const [search, setSearch] = useState('');
  const [selectedEdition, setSelectedEdition] = useState<number | undefined>();

  // Преузми књиге
  const { data: booksData, isLoading: booksLoading } = trpc.books.getPublic.useQuery({
    search: search || undefined,
    editionId: selectedEdition,
  });

  // Преузми едиције за филтер
  const { data: editions } = trpc.editions.getAll.useQuery();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero секција */}
        <section className="bg-gradient-to-b from-secondary to-background py-16">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-5xl font-bold text-foreground mb-6">
                Добродошли у Салон књиге
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Откријте богату колекцију издања Српске књиге
              </p>
            </div>
          </div>
        </section>

        {/* Претрага и филтери */}
        <section className="py-8 border-b border-border">
          <div className="container">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              {/* Претрага */}
              <div className="flex-1 w-full relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder={t.search}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Филтер по едицији */}
              <Select
                value={selectedEdition?.toString() || 'all'}
                onValueChange={(value) => setSelectedEdition(value === 'all' ? undefined : parseInt(value))}
              >
                <SelectTrigger className="w-full md:w-64">
                  <SelectValue placeholder={t.edition} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t.all}</SelectItem>
                  {editions?.map((edition) => (
                    <SelectItem key={edition.id} value={edition.id.toString()}>
                      {edition.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* Каталог књига */}
        <section className="py-12">
          <div className="container">
            {booksLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : booksData && booksData.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {booksData.map(({ book, author, edition }) => (
                  <Card key={book.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      {/* Слика корице (placeholder за сада) */}
                      <div className="aspect-[3/4] bg-muted rounded-md mb-4 flex items-center justify-center">
                        {book.coverImageUrl ? (
                          <img
                            src={book.coverImageUrl}
                            alt={book.title}
                            className="w-full h-full object-cover rounded-md"
                          />
                        ) : (
                          <span className="text-muted-foreground text-sm">
                            Нема слике
                          </span>
                        )}
                      </div>
                      <CardTitle className="text-lg line-clamp-2">
                        {book.title}
                      </CardTitle>
                      {author && (
                        <p className="text-sm text-muted-foreground">
                          {author.fullName}
                        </p>
                      )}
                    </CardHeader>

                    <CardContent>
                      {edition && (
                        <p className="text-xs text-accent mb-2">
                          {edition.name}
                        </p>
                      )}
                      {book.price ? (
                        <p className="text-lg font-bold text-primary">
                          {book.price} РСД
                        </p>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          Цена ће бити доступна ускоро
                        </p>
                      )}
                    </CardContent>

                    <CardFooter className="flex gap-2">
                      <Link href={`/books/${book.id}`} className="flex-1">
                        <Button variant="default" className="w-full">
                          {t.readMore}
                        </Button>
                      </Link>
                      <Button variant="outline" size="icon">
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <ShoppingCart className="h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-muted-foreground text-lg">
                  Нема књига за приказ
                </p>
              </div>
            )}
          </div>
        </section>
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
