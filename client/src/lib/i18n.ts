// Систем за вишејезичност - Ћирилица, Латиница, Енглески

export type Language = 'sr-Cyrl' | 'sr-Latn' | 'en';

export interface Translations {
  // Navigation
  home: string;
  books: string;
  authors: string;
  editions: string;
  about: string;
  contact: string;
  cart: string;
  favorites: string;
  
  // Common
  search: string;
  filter: string;
  sortBy: string;
  price: string;
  quantity: string;
  addToCart: string;
  addToFavorites: string;
  orderNow: string;
  readMore: string;
  showMore: string;
  showLess: string;
  
  // Book details
  author: string;
  edition: string;
  isbn: string;
  description: string;
  inStock: string;
  outOfStock: string;
  
  // Filters
  all: string;
  forChildren: string;
  poetry: string;
  novel: string;
  shortStories: string;
  essays: string;
  
  // Cart & Order
  yourCart: string;
  emptyCart: string;
  total: string;
  checkout: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  message: string;
  sendOrder: string;
  
  // Admin
  admin: string;
  dashboard: string;
  manageBooks: string;
  manageAuthors: string;
  manageEditions: string;
  addNew: string;
  edit: string;
  delete: string;
  save: string;
  cancel: string;
}

export const translations: Record<Language, Translations> = {
  'sr-Cyrl': {
    // Navigation
    home: 'Почетна',
    books: 'Књиге',
    authors: 'Аутори',
    editions: 'Едиције',
    about: 'О нама',
    contact: 'Контакт',
    cart: 'Корпа',
    favorites: 'Омиљено',
    
    // Common
    search: 'Претрага',
    filter: 'Филтер',
    sortBy: 'Сортирај',
    price: 'Цена',
    quantity: 'Количина',
    addToCart: 'Додај у корпу',
    addToFavorites: 'Додај у омиљено',
    orderNow: 'Наручи сада',
    readMore: 'Прочитај више',
    showMore: 'Прикажи више',
    showLess: 'Прикажи мање',
    
    // Book details
    author: 'Аутор',
    edition: 'Едиција',
    isbn: 'ISBN',
    description: 'Опис',
    inStock: 'На стању',
    outOfStock: 'Нема на стању',
    
    // Filters
    all: 'Све',
    forChildren: 'За децу',
    poetry: 'Поезија',
    novel: 'Роман',
    shortStories: 'Приповетке',
    essays: 'Есеји',
    
    // Cart & Order
    yourCart: 'Ваша корпа',
    emptyCart: 'Корпа је празна',
    total: 'Укупно',
    checkout: 'Наручи',
    name: 'Име и презиме',
    email: 'Е-пошта',
    phone: 'Телефон',
    address: 'Адреса',
    message: 'Порука',
    sendOrder: 'Пошаљи наруџбину',
    
    // Admin
    admin: 'Администрација',
    dashboard: 'Контролна табла',
    manageBooks: 'Управљање књигама',
    manageAuthors: 'Управљање ауторима',
    manageEditions: 'Управљање едицијама',
    addNew: 'Додај ново',
    edit: 'Измени',
    delete: 'Обриши',
    save: 'Сачувај',
    cancel: 'Откажи',
  },
  'sr-Latn': {
    // Navigation
    home: 'Početna',
    books: 'Knjige',
    authors: 'Autori',
    editions: 'Edicije',
    about: 'O nama',
    contact: 'Kontakt',
    cart: 'Korpa',
    favorites: 'Omiljeno',
    
    // Common
    search: 'Pretraga',
    filter: 'Filter',
    sortBy: 'Sortiraj',
    price: 'Cena',
    quantity: 'Količina',
    addToCart: 'Dodaj u korpu',
    addToFavorites: 'Dodaj u omiljeno',
    orderNow: 'Naruči sada',
    readMore: 'Pročitaj više',
    showMore: 'Prikaži više',
    showLess: 'Prikaži manje',
    
    // Book details
    author: 'Autor',
    edition: 'Edicija',
    isbn: 'ISBN',
    description: 'Opis',
    inStock: 'Na stanju',
    outOfStock: 'Nema na stanju',
    
    // Filters
    all: 'Sve',
    forChildren: 'Za decu',
    poetry: 'Poezija',
    novel: 'Roman',
    shortStories: 'Pripovetke',
    essays: 'Eseji',
    
    // Cart & Order
    yourCart: 'Vaša korpa',
    emptyCart: 'Korpa je prazna',
    total: 'Ukupno',
    checkout: 'Naruči',
    name: 'Ime i prezime',
    email: 'E-pošta',
    phone: 'Telefon',
    address: 'Adresa',
    message: 'Poruka',
    sendOrder: 'Pošalji narudžbinu',
    
    // Admin
    admin: 'Administracija',
    dashboard: 'Kontrolna tabla',
    manageBooks: 'Upravljanje knjigama',
    manageAuthors: 'Upravljanje autorima',
    manageEditions: 'Upravljanje edicijama',
    addNew: 'Dodaj novo',
    edit: 'Izmeni',
    delete: 'Obriši',
    save: 'Sačuvaj',
    cancel: 'Otkaži',
  },
  'en': {
    // Navigation
    home: 'Home',
    books: 'Books',
    authors: 'Authors',
    editions: 'Editions',
    about: 'About',
    contact: 'Contact',
    cart: 'Cart',
    favorites: 'Favorites',
    
    // Common
    search: 'Search',
    filter: 'Filter',
    sortBy: 'Sort by',
    price: 'Price',
    quantity: 'Quantity',
    addToCart: 'Add to cart',
    addToFavorites: 'Add to favorites',
    orderNow: 'Order now',
    readMore: 'Read more',
    showMore: 'Show more',
    showLess: 'Show less',
    
    // Book details
    author: 'Author',
    edition: 'Edition',
    isbn: 'ISBN',
    description: 'Description',
    inStock: 'In stock',
    outOfStock: 'Out of stock',
    
    // Filters
    all: 'All',
    forChildren: 'For children',
    poetry: 'Poetry',
    novel: 'Novel',
    shortStories: 'Short stories',
    essays: 'Essays',
    
    // Cart & Order
    yourCart: 'Your cart',
    emptyCart: 'Cart is empty',
    total: 'Total',
    checkout: 'Checkout',
    name: 'Full name',
    email: 'Email',
    phone: 'Phone',
    address: 'Address',
    message: 'Message',
    sendOrder: 'Send order',
    
    // Admin
    admin: 'Administration',
    dashboard: 'Dashboard',
    manageBooks: 'Manage books',
    manageAuthors: 'Manage authors',
    manageEditions: 'Manage editions',
    addNew: 'Add new',
    edit: 'Edit',
    delete: 'Delete',
    save: 'Save',
    cancel: 'Cancel',
  },
};

export function getTranslations(lang: Language): Translations {
  return translations[lang];
}
