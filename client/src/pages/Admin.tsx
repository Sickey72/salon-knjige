import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function AdminPage() {
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [editData, setEditData] = useState<any>({});
  const [imageFile, setImageFile] = useState<File | null>(null);

  const booksQuery = trpc.books.getAll.useQuery();
  const books = booksQuery.data || [];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleSave = async () => {
    // Trebalo bi da kreiram API endpoint za update
    console.log("Saving:", editData);
    setSelectedBook(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Admin Panel - Salon Knjige</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book: any) => (
            <Dialog key={book.id}>
              <DialogTrigger asChild>
                <div
                  className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition"
                  onClick={() => {
                    setSelectedBook(book);
                    setEditData({
                      title: book.title,
                      price: book.price,
                      description: book.description,
                    });
                  }}
                >
                  <div className="aspect-square bg-gray-200 rounded mb-4 flex items-center justify-center">
                    {book.coverImage ? (
                      <img
                        src={book.coverImage}
                        alt={book.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-400">Nema slike</span>
                    )}
                  </div>
                  <h3 className="font-semibold text-sm mb-2 line-clamp-2">
                    {book.title}
                  </h3>
                  <p className="text-lg font-bold text-blue-600">
                    {book.price ? `${book.price} дин.` : "Cijena nije postavljena"}
                  </p>
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Uredi - {book.title}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Naslov
                    </label>
                    <Input
                      value={editData.title || ""}
                      onChange={(e) =>
                        setEditData({ ...editData, title: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Cijena (дин.)
                    </label>
                    <Input
                      type="number"
                      value={editData.price || ""}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          price: parseFloat(e.target.value),
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Opis
                    </label>
                    <Textarea
                      value={editData.description || ""}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          description: e.target.value,
                        })
                      }
                      rows={4}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Slika korica
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="block w-full"
                    />
                    {imageFile && (
                      <p className="text-sm text-green-600 mt-2">
                        ✓ Odabrana slika: {imageFile.name}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2 justify-end">
                    <Button variant="outline">Otkaži</Button>
                    <Button onClick={handleSave}>Spremi</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>

        <div className="mt-12 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Dodatne opcije</h2>
          <div className="space-y-4">
            <Button className="w-full">Dodaj novu knjiga</Button>
            <Button className="w-full" variant="outline">
              Upravljaj autorima
            </Button>
            <Button className="w-full" variant="outline">
              Upravljaj edicijama
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
