import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import * as dotenv from 'dotenv';
dotenv.config();

// Initialize the Prisma Client with the pg adapter directly here so ts-node can execute it
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is not set in the environment variables.');
}
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const slugify = (text: string, id: string) => {
  const baseSlug = text.toString().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
  
  return `${baseSlug}-${id.substring(0, 6)}`;
};

async function main() {
  console.log('Starting import process...');

  // 1. Load Taxonomy
  const taxonomyPath = path.join(process.cwd(), 'Categories and sub categories.txt');
  let validCategories = new Set<string>();
  
  if (fs.existsSync(taxonomyPath)) {
    const taxonomyText = fs.readFileSync(taxonomyPath, 'utf-8');
    validCategories = new Set(
      taxonomyText.split('\n')
        .filter(line => line.includes('|') && !line.includes('Category'))
        .map(line => line.split('|')[1]?.trim().toLowerCase())
        .filter(Boolean)
    );
    console.log(`Loaded ${validCategories.size} valid categories from taxonomy.`);
  } else {
    console.warn('Taxonomy file not found. Categories will not be strictly validated.');
  }

  // 2. Parse and Upsert
  const csvPath = path.join(process.cwd(), 'vendors.csv');
  if (!fs.existsSync(csvPath)) {
    throw new Error('vendors.csv not found in the root directory!');
  }

  const results: any[] = [];

  fs.createReadStream(csvPath)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      console.log(`Parsed ${results.length} rows. Injecting into Neon database...`);

      let successCount = 0;
      let errorCount = 0;

      for (const row of results) {
        try {
          let rawCategory = row['Category']?.trim().toLowerCase();
          if (validCategories.size > 0 && !validCategories.has(rawCategory)) {
            rawCategory = 'other'; 
          }

          const vendorName = row['Name']?.trim() || 'Unnamed Vendor';
          const idKey = Object.keys(row).find(key => key.includes('ID'));
          const vendorId = idKey ? row[idKey]?.trim() : undefined;
          
          if (!vendorId) {
             console.log(`Skipping row due to missing ID: ${vendorName}`);
             continue;
          }

          const uniqueSlug = slugify(vendorName, vendorId);

          await prisma.vendor.upsert({
            where: { slug: uniqueSlug },
            update: {}, // Protect existing manual edits
            create: {
              slug: uniqueSlug,
              name: vendorName,
              category: rawCategory || 'other',
              description: row['Type'] ? `Specializes in ${row['Type'].trim()}` : '',
              city: row['Cities']?.trim() || 'Not specified',
              state: row['Countries']?.trim() || 'Not specified', 
              price: parseFloat(row['Price']) || 0,
              experience: parseInt(row['Experience']) || 0,
              profilePic: row['Profile']?.trim() || null,
              coverImage: row['Thumbnail']?.trim() || null,
              
              signatureStyle: row['Signature']?.trim() || null,
              brandsUsed: row['Brands']?.trim() || null,
              serviceCities: row['Cities']?.trim() || null,
              serviceCountries: row['Countries']?.trim() || null,
              idealBooking: row['Booking']?.trim() || null,
              
              clientsCount: parseInt(row['Clients']) || 0,
              communitiesCount: parseInt(row['Communities']) || 0,
              citiesCount: parseInt(row['CitiesNumber']) || 0,
              countriesCount: parseInt(row['CountriesNumber']) || 0,

              portfolioImages: row['Portfolio'] ? [row['Portfolio'].trim()] : [],
            }
          });
          successCount++;
        } catch (error) {
          console.error(`Failed to insert vendor: ${row['Name']}`, error);
          errorCount++;
        }
      }

      console.log(`\nImport Complete!`);
      console.log(`✅ Successfully imported: ${successCount}`);
      console.log(`❌ Failed imports: ${errorCount}`);
      
      await prisma.$disconnect();
    });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
