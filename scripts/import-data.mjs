import { readFileSync } from 'fs';
import { drizzle } from 'drizzle-orm/mysql2';
import { authors, editions, books, tags, bookTags } from '../drizzle/schema.js';
import 'dotenv/config';

// Учитај Excel податке (конвертоване у JSON)
const excelData = JSON.parse(readFileSync('/home/ubuntu/salon_knjige/scripts/books-data.json', 'utf-8'));

const db = drizzle(process.env.DATABASE_URL);

async function importData() {
  console.log('🚀 Почетак увоза података...');
  
  // 1. Креирај "Слободна издања" едицију
  console.log('📚 Креирање подразумеване едиције...');
  const [defaultEdition] = await db.insert(editions).values({
    name: 'Слободна издања',
    description: 'Књиге које нису сврстане у посебне едиције',
  }).$returningId();
  
  // 2. Извуци јединствене едиције из података
  const uniqueEditions = new Map();
  for (const row of excelData) {
    if (row.Biblioteka && row.Biblioteka.trim()) {
      const editionName = row.Biblioteka.trim();
      if (!uniqueEditions.has(editionName)) {
        uniqueEditions.set(editionName, true);
      }
    }
  }
  
  console.log(`📚 Увоз ${uniqueEditions.size} едиција...`);
  const editionMap = new Map();
  editionMap.set('Слободна издања', defaultEdition.id);
  
  for (const editionName of uniqueEditions.keys()) {
    const [edition] = await db.insert(editions).values({
      name: editionName,
    }).$returningId();
    editionMap.set(editionName, edition.id);
  }
  
  // 3. Извуци јединствене ауторе
  const uniqueAuthors = new Map();
  for (const row of excelData) {
    if (row.Pisac && row.Pisac.trim()) {
      const authorName = row.Pisac.trim();
      if (!uniqueAuthors.has(authorName)) {
        uniqueAuthors.set(authorName, true);
      }
    }
  }
  
  console.log(`✍️ Увоз ${uniqueAuthors.size} аутора...`);
  const authorMap = new Map();
  
  for (const authorName of uniqueAuthors.keys()) {
    // Покушај да раздвојиш име и презиме
    const parts = authorName.split(' ');
    const firstName = parts.length > 1 ? parts.slice(0, -1).join(' ') : null;
    const lastName = parts.length > 1 ? parts[parts.length - 1] : null;
    
    const [author] = await db.insert(authors).values({
      fullName: authorName,
      firstName,
      lastName,
    }).$returningId();
    authorMap.set(authorName, author.id);
  }
  
  // 4. Креирај иницијалне тагове
  console.log('🏷️ Креирање иницијалних тагова...');
  const initialTags = [
    { name: 'За децу', slug: 'za-decu' },
    { name: 'Поезија', slug: 'poezija' },
    { name: 'Роман', slug: 'roman' },
    { name: 'Приповетке', slug: 'pripovetke' },
    { name: 'Есеји', slug: 'eseji' },
  ];
  
  const tagMap = new Map();
  for (const tag of initialTags) {
    const [insertedTag] = await db.insert(tags).values(tag).$returningId();
    tagMap.set(tag.name, insertedTag.id);
  }
  
  // 5. Увези књиге
  console.log(`📖 Увоз ${excelData.length} књига...`);
  let imported = 0;
  let skipped = 0;
  
  for (const row of excelData) {
    // Прескочи редове без наслова
    if (!row['Naziv dela'] || !row['Naziv dela'].trim()) {
      skipped++;
      continue;
    }
    
    const title = row['Naziv dela'].trim();
    const subtitle = row.podnaslov?.trim() || null;
    const authorName = row.Pisac?.trim();
    const editionName = row.Biblioteka?.trim();
    const quantity = parseInt(row.Kolicina) || 0;
    const price = row.Cena ? parseInt(row.Cena) : null;
    const isbn = row.ISBN?.trim() || null;
    const description = row.Opis?.trim() || null;
    
    // Одреди аутора
    const authorId = authorName ? authorMap.get(authorName) : null;
    
    // Одреди едицију
    const editionId = editionName && editionMap.has(editionName) 
      ? editionMap.get(editionName) 
      : defaultEdition.id;
    
    const [book] = await db.insert(books).values({
      title,
      subtitle,
      authorId,
      editionId,
      quantity,
      price,
      isbn,
      description,
    }).$returningId();
    
    // Додај таг "За децу" ако је у опису
    if (description && description.includes('За децу') && tagMap.has('За децу')) {
      await db.insert(bookTags).values({
        bookId: book.id,
        tagId: tagMap.get('За децу'),
      });
    }
    
    imported++;
  }
  
  console.log('✅ Увоз завршен!');
  console.log(`   - Увезено књига: ${imported}`);
  console.log(`   - Прескочено: ${skipped}`);
  console.log(`   - Аутора: ${uniqueAuthors.size}`);
  console.log(`   - Едиција: ${uniqueEditions.size + 1}`);
  
  process.exit(0);
}

importData().catch(err => {
  console.error('❌ Грешка при увозу:', err);
  process.exit(1);
});
