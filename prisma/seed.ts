import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { MOCK_VENDORS } from '../lib/mockData'

const connectionString = `${process.env.DATABASE_URL}`
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Starting database seeding...')

  await Promise.all(
    MOCK_VENDORS.map(async (vendor) => {
      // Generate a URL-friendly slug (e.g., "Anjali Bridal Studio" -> "anjali-bridal-studio")
      const slug = vendor.slug ?? vendor.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')

      // Check if vendor already exists to prevent duplicate seeding
      const existingVendor = await prisma.vendor.findUnique({
        where: { slug }
      })

      if (!existingVendor) {
        const createdVendor = await prisma.vendor.create({
          data: {
            slug,
            name: vendor.name,
            city: vendor.location?.city || 'Unknown',
            state: vendor.location?.state || 'Unknown',
            profilePic: vendor.profilePic || null,
            portfolio: vendor.portfolio ? {
              create: {
                experience: vendor.portfolio.experience || '0 Years',
                clients: vendor.portfolio.clients || '0',
                communities: vendor.portfolio.communities || '0',
                cities: vendor.portfolio.cities || '1',
                priceRange: vendor.portfolio.priceRange || 'Contact for pricing',
                bookingBefore: vendor.portfolio.bookingBefore || 'Flexible',
                signatureStyle: vendor.portfolio.additionalInfo?.signatureStyle || null,
                brandsUsed: vendor.portfolio.additionalInfo?.brands || [],
                gallery: vendor.portfolio.gallery || []
              }
            } : undefined
          }
        })
        console.log(`✅ Seeded Vendor: ${createdVendor.name}`)
      } else {
        console.log(`⏭️  Skipped (Already exists): ${existingVendor.name}`)
      }
    })
  )

  console.log('Database seeding completed successfully.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
