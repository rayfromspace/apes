const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  // Clean existing data
  await prisma.user.deleteMany()

  // Create test users
  const users = [
    {
      email: 'john.doe@example.com',
      password: await bcrypt.hash('password123', 10),
      full_name: 'John Doe',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
      role: 'both',
      bio: 'Creative director and digital artist with 10+ years of experience. Passionate about blockchain technology and NFTs.',
      twitter_url: 'https://twitter.com/johndoeart',
      linkedin_url: 'https://linkedin.com/in/johndoe',
      company: 'ArtTech Studios',
      position: 'Creative Director',
      location: 'San Francisco, CA',
      interests: ['Digital Art', 'NFTs', 'Web3', 'Creative Technology'],
      skills: ['Digital Art', 'NFT Creation', 'Project Management', 'Web3'],
    },
    {
      email: 'sarah.smith@example.com',
      password: await bcrypt.hash('password123', 10),
      full_name: 'Sarah Smith',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      role: 'founder',
      bio: 'Award-winning 3D artist specializing in character design and animation. Currently working on a collection of animated NFTs.',
      twitter_url: 'https://twitter.com/sarahcreates',
      linkedin_url: 'https://linkedin.com/in/sarahsmith',
      company: 'Indie Creator',
      position: '3D Artist',
      location: 'Los Angeles, CA',
      interests: ['3D Art', 'Animation', 'Character Design', 'NFTs'],
      skills: ['3D Modeling', 'Character Design', 'Animation', 'Blender'],
    },
    {
      email: 'alex.investor@example.com',
      password: await bcrypt.hash('password123', 10),
      full_name: 'Alex Chen',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
      role: 'investor',
      bio: 'Angel investor focused on Web3 and creative technology. Supporting innovative artists and creators in the NFT space.',
      twitter_url: 'https://twitter.com/alexinvests',
      linkedin_url: 'https://linkedin.com/in/alexchen',
      company: 'Web3 Ventures',
      position: 'Managing Partner',
      location: 'New York, NY',
      interests: ['Web3', 'NFT Investment', 'Creative Tech', 'DeFi'],
      skills: ['Investment Strategy', 'NFT Trading', 'Portfolio Management'],
    },
  ]

  for (const user of users) {
    await prisma.user.create({
      data: {
        email: user.email,
        password: user.password,
        full_name: user.full_name,
        avatar_url: user.avatar_url,
        role: user.role as any,
        bio: user.bio,
        twitter_url: user.twitter_url,
        linkedin_url: user.linkedin_url,
        company: user.company,
        position: user.position,
        location: user.location,
        interests: user.interests,
        skills: user.skills,
      },
    })
  }

  console.log('Seed data created successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
