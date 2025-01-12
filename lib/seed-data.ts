const { createClient } = require('@supabase/supabase-js');
const { faker } = require('@faker-js/faker');

interface Profile {
  id: string;
  full_name: string;
  avatar_url: string;
  bio: string;
  profession: string;
  skills: string[];
  location: string;
  created_at: Date;
  updated_at: Date;
}

interface Project {
  id: string;
  title: string;
  description: string;
  image_url: string;
  github_url: string;
  live_url: string;
  tech_stack: string[];
  status: string;
  founder_id: string;
  created_at: Date;
  updated_at: Date;
}

interface TeamMember {
  id: string;
  project_id: string;
  user_id: string;
  role: string;
  created_at: Date;
}

interface Post {
  id: string;
  author_id: string;
  content: string;
  topic_id: string;
  topic_name: string;
  topic_icon: string;
  image_url: string | null;
  link_url: string | null;
  likes_count: number;
  comments_count: number;
  created_at: Date;
  updated_at: Date;
}

interface Comment {
  id: string;
  post_id: string;
  author_id: string;
  content: string;
  created_at: Date;
  updated_at: Date;
}

interface Like {
  id: string;
  post_id: string;
  user_id: string;
  created_at: Date;
}

interface Bookmark {
  id: string;
  post_id: string;
  user_id: string;
  created_at: Date;
}

interface FinancialTransaction {
  id: string;
  user_id: string;
  project_id: string;
  amount: number;
  status: string;
  type: string;
  created_at: Date;
}

interface Notification {
  id: string;
  user_id: string;
  type: string;
  content: string;
  read: boolean;
  data: any;
  created_at: Date;
}

interface Connection {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: Date;
}

// Topics from your ExploreFeed component
const TOPICS = [
  { id: "tech", name: "Technology", icon: "💻" },
  { id: "defi", name: "DeFi", icon: "💰" },
  { id: "ai", name: "Artificial Intelligence", icon: "🤖" },
  { id: "web3", name: "Web3", icon: "🌐" },
  { id: "dev", name: "Development", icon: "⚡" },
  { id: "research", name: "Research", icon: "🔬" },
];

// Create test users for seeding
async function createTestUsers(supabase) {
  const users = [];
  for (let i = 0; i < 10; i++) {
    const email = faker.internet.email();
    const password = 'password123'; // Simple password for testing
    
    const { data: authUser, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: faker.person.fullName(),
        }
      }
    });

    if (authError) throw authError;
    if (authUser.user) users.push(authUser.user);
  }
  return users;
}

const SEED_DATA = {
  profiles: (users) => users.map(user => ({
    id: user.id,
    full_name: user.user_metadata.full_name,
    avatar_url: faker.image.avatar(),
    bio: faker.lorem.paragraph(),
    profession: faker.person.jobTitle(),
    skills: Array.from({ length: faker.number.int({ min: 2, max: 5 }) }, () => faker.person.jobArea()),
    location: faker.location.city() + ', ' + faker.location.country(),
    created_at: new Date(),
    updated_at: new Date()
  })),

  projects: (users) => Array.from({ length: 20 }, () => ({
    id: faker.string.uuid(),
    founder_id: faker.helpers.arrayElement(users).id,
    title: faker.company.catchPhrase(),
    description: faker.lorem.paragraph(),
    image_url: faker.image.url(),
    github_url: 'https://github.com/example/project',
    live_url: 'https://example.com',
    tech_stack: Array.from({ length: faker.number.int({ min: 2, max: 5 }) }, () => faker.helpers.arrayElement(['React', 'Node.js', 'Python', 'TypeScript', 'PostgreSQL', 'Next.js'])),
    status: faker.helpers.arrayElement(['In Progress', 'Completed', 'Planning']),
    created_at: faker.date.past(),
    updated_at: faker.date.recent()
  })),

  team_members: (users, projects) => 
    projects.flatMap(project => 
      Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () => ({
        id: faker.string.uuid(),
        project_id: project.id,
        user_id: faker.helpers.arrayElement(users.filter(u => u.id !== project.founder_id)).id,
        role: faker.helpers.arrayElement(['Developer', 'Designer', 'Product Manager']),
        created_at: faker.date.past()
      }))
    ),

  posts: (users) => Array.from({ length: 50 }, () => {
    const topic = faker.helpers.arrayElement(TOPICS);
    return {
      id: faker.string.uuid(),
      author_id: faker.helpers.arrayElement(users).id,
      content: faker.lorem.paragraph(),
      topic_id: topic.id,
      topic_name: topic.name,
      topic_icon: topic.icon,
      image_url: faker.helpers.maybe(() => faker.image.url(), { probability: 0.3 }),
      link_url: faker.helpers.maybe(() => faker.internet.url(), { probability: 0.2 }),
      likes_count: 0,
      comments_count: 0,
      created_at: faker.date.recent(),
      updated_at: faker.date.recent()
    };
  }),

  comments: (users, posts) => 
    posts.flatMap(post => 
      Array.from({ length: faker.number.int({ min: 0, max: 5 }) }, () => ({
        id: faker.string.uuid(),
        post_id: post.id,
        author_id: faker.helpers.arrayElement(users).id,
        content: faker.lorem.sentence(),
        created_at: faker.date.recent(),
        updated_at: faker.date.recent()
      }))
    ),

  likes: (users, posts) => 
    posts.flatMap(post => 
      Array.from({ length: faker.number.int({ min: 0, max: 10 }) }, () => ({
        id: faker.string.uuid(),
        post_id: post.id,
        user_id: faker.helpers.arrayElement(users).id,
        created_at: faker.date.recent()
      }))
    ),

  bookmarks: (users, posts) => 
    users.flatMap(user => 
      faker.helpers.arrayElements(posts, faker.number.int({ min: 0, max: 5 })).map(post => ({
        id: faker.string.uuid(),
        post_id: post.id,
        user_id: user.id,
        created_at: faker.date.recent()
      }))
    ),

  financial_transactions: (users, projects) => 
    projects.flatMap(project => 
      Array.from({ length: faker.number.int({ min: 0, max: 3 }) }, () => ({
        id: faker.string.uuid(),
        project_id: project.id,
        user_id: faker.helpers.arrayElement(users).id,
        amount: faker.number.float({ min: 10, max: 1000, precision: 0.01 }),
        status: faker.helpers.arrayElement(['completed', 'pending', 'failed']),
        type: faker.helpers.arrayElement(['donation', 'investment', 'grant']),
        created_at: faker.date.recent()
      }))
    ),

  notifications: (users, posts, projects) => 
    users.flatMap(user => 
      Array.from({ length: faker.number.int({ min: 0, max: 5 }) }, () => {
        const type = faker.helpers.arrayElement(['like', 'comment', 'follow', 'project_update']);
        const relatedPost = faker.helpers.arrayElement(posts);
        const relatedProject = faker.helpers.arrayElement(projects);
        
        return {
          id: faker.string.uuid(),
          user_id: user.id,
          type,
          content: faker.lorem.sentence(),
          read: faker.datatype.boolean(),
          data: {
            post_id: type === 'like' || type === 'comment' ? relatedPost.id : null,
            project_id: type === 'project_update' ? relatedProject.id : null
          },
          created_at: faker.date.recent()
        };
      })
    ),

  connections: (users) => 
    users.flatMap(user => 
      // Each user follows 3-7 other users
      Array.from({ length: faker.number.int({ min: 3, max: 7 }) }, () => {
        const following = faker.helpers.arrayElement(users.filter(u => u.id !== user.id));
        return {
          id: faker.string.uuid(),
          follower_id: user.id,
          following_id: following.id,
          created_at: faker.date.past()
        };
      })
    )
};

async function seedDatabase(supabase) {
  try {
    // Create test users
    console.log('Creating test users...');
    const users = await createTestUsers(supabase);
    if (!users.length) throw new Error('Failed to create test users');

    // Create user profiles
    console.log('Creating user profiles...');
    const profiles = SEED_DATA.profiles(users);
    const { error: profileError } = await supabase
      .from('user_profiles')
      .upsert(profiles);
    if (profileError) throw profileError;

    // Create projects
    console.log('Creating projects...');
    const projects = SEED_DATA.projects(users);
    const { error: projectError } = await supabase
      .from('projects')
      .upsert(projects);
    if (projectError) throw projectError;

    // Create team members
    console.log('Creating team members...');
    const teamMembers = SEED_DATA.team_members(users, projects);
    const { error: teamError } = await supabase
      .from('team_members')
      .upsert(teamMembers);
    if (teamError) throw teamError;

    // Create posts
    console.log('Creating posts...');
    const posts = SEED_DATA.posts(users);
    const { error: postError } = await supabase
      .from('posts')
      .upsert(posts);
    if (postError) throw postError;

    // Create comments
    console.log('Creating comments...');
    const comments = SEED_DATA.comments(users, posts);
    const { error: commentError } = await supabase
      .from('comments')
      .upsert(comments);
    if (commentError) throw commentError;

    // Create likes
    console.log('Creating likes...');
    const likes = SEED_DATA.likes(users, posts);
    const { error: likeError } = await supabase
      .from('likes')
      .upsert(likes);
    if (likeError) throw likeError;

    // Create bookmarks
    console.log('Creating bookmarks...');
    const bookmarks = SEED_DATA.bookmarks(users, posts);
    const { error: bookmarkError } = await supabase
      .from('bookmarks')
      .upsert(bookmarks);
    if (bookmarkError) throw bookmarkError;

    // Create financial transactions
    console.log('Creating financial transactions...');
    const transactions = SEED_DATA.financial_transactions(users, projects);
    const { error: transactionError } = await supabase
      .from('financial_transactions')
      .upsert(transactions);
    if (transactionError) throw transactionError;

    // Create notifications
    console.log('Creating notifications...');
    const notifications = SEED_DATA.notifications(users, posts, projects);
    const { error: notificationError } = await supabase
      .from('notifications')
      .upsert(notifications);
    if (notificationError) throw notificationError;

    // Create connections
    console.log('Creating connections...');
    const connections = SEED_DATA.connections(users);
    const { error: connectionError } = await supabase
      .from('connections')
      .upsert(connections);
    if (connectionError) throw connectionError;

    // Update post counts
    console.log('Updating post counts...');
    for (const post of posts) {
      const likesCount = likes.filter(l => l.post_id === post.id).length;
      const commentsCount = comments.filter(c => c.post_id === post.id).length;
      
      const { error: updateError } = await supabase
        .from('posts')
        .update({ 
          likes_count: likesCount,
          comments_count: commentsCount
        })
        .eq('id', post.id);
      
      if (updateError) throw updateError;
    }

    console.log('Seed completed successfully');
    return { users };
  } catch (error) {
    console.error('Seed error:', error);
    throw error;
  }
}

const seedDatabase = async (supabase) => {
  // Add your seed data here if needed
  console.log('No seed data to insert');
};

module.exports = { seedDatabase };
