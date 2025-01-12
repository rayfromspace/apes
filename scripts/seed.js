const { createClient } = require('@supabase/supabase-js');
const { faker } = require('@faker-js/faker');

const supabaseUrl = 'https://ubckieucltnuxweoipnv.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InViY2tpZXVjbHRudXh3ZW9pcG52Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMzI2OTIwMSwiZXhwIjoyMDQ4ODQ1MjAxfQ.J9PCoBovk0X0tg9BQg64yGG1zQjYi22dG0mCIHoO2Jo';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

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
async function createTestUsers() {
  const users = [];
  const testUsers = [
    {
      email: 'test.user1@example.com',
      password: 'password123',
      full_name: faker.person.fullName()
    },
    {
      email: 'test.user2@example.com',
      password: 'password123',
      full_name: faker.person.fullName()
    },
    {
      email: 'test.user3@example.com',
      password: 'password123',
      full_name: faker.person.fullName()
    }
  ];

  for (const user of testUsers) {
    try {
      // First try to get the user
      const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers();

      if (listError) {
        console.error(`Error listing users:`, listError);
        throw listError;
      }

      const existingUser = existingUsers?.users?.find(u => u.email === user.email);

      if (existingUser) {
        console.log(`User ${user.email} already exists, updating...`);
        const { data: updateData, error: updateError } = await supabase.auth.admin.updateUserById(
          existingUser.id,
          {
            email: user.email,
            password: user.password,
            email_confirm: true,
            user_metadata: {
              full_name: user.full_name
            }
          }
        );

        if (updateError) {
          console.error(`Error updating user ${user.email}:`, updateError);
          throw updateError;
        }

        if (updateData?.user) {
          users.push(updateData.user);
        }
        console.log(`Updated user ${user.email}`);
      } else {
        console.log(`Creating new user ${user.email}...`);
        const { data: createData, error: createError } = await supabase.auth.admin.createUser({
          email: user.email,
          password: user.password,
          email_confirm: true,
          user_metadata: {
            full_name: user.full_name
          }
        });

        if (createError) {
          console.error(`Error creating user ${user.email}:`, createError);
          throw createError;
        }

        if (createData?.user) {
          users.push(createData.user);
        }
        console.log(`Created user ${user.email}`);
      }
    } catch (error) {
      console.error(`Error processing user ${user.email}:`, error);
      throw error;
    }
  }

  if (users.length === 0) {
    throw new Error('Failed to create any users');
  }

  return users;
}

const SEED_DATA = {
  profiles: (users) => users.map(user => ({
    id: user.id,
    full_name: faker.person.fullName(),
    avatar_url: faker.image.avatar(),
    bio: faker.lorem.paragraph(),
    profession: faker.person.jobTitle(),
    skills: Array.from({ length: 3 }, () => faker.person.jobArea()),
    location: faker.location.city(),
    created_at: faker.date.past(),
    updated_at: faker.date.recent()
  })),

  projects: (users) => Array.from({ length: 20 }, () => ({
    id: faker.string.uuid(),
    title: faker.company.catchPhrase(),
    description: faker.lorem.paragraphs(2),
    type: faker.helpers.arrayElement(['Research', 'Development', 'Design', 'Marketing']),
    category: faker.helpers.arrayElement(['Web3', 'AI', 'DeFi', 'Infrastructure']),
    status: faker.helpers.arrayElement(['active', 'completed', 'on-hold']),
    visibility: faker.helpers.arrayElement(['public', 'private']),
    image_url: faker.image.url(),
    owner_id: faker.helpers.arrayElement(users).id,
    created_at: faker.date.past(),
    updated_at: faker.date.recent()
  })),

  team_members: (users, projects) => projects.flatMap(project => 
    Array.from({ length: faker.number.int({ min: 2, max: 5 }) }, () => ({
      id: faker.string.uuid(),
      project_id: project.id,
      user_id: faker.helpers.arrayElement(users).id,
      role: faker.helpers.arrayElement(['admin', 'member', 'viewer']),
      joined_at: faker.date.past()
    }))
  ),

  posts: (users) => Array.from({ length: 50 }, () => {
    const topic = faker.helpers.arrayElement(TOPICS);
    const hasImage = faker.datatype.boolean();
    const hasLink = faker.datatype.boolean();
    
    return {
      id: faker.string.uuid(),
      author_id: faker.helpers.arrayElement(users).id,
      content: faker.lorem.paragraphs(faker.number.int({ min: 1, max: 3 })),
      topic_id: topic.id,
      topic_name: topic.name,
      topic_icon: topic.icon,
      image_url: hasImage ? faker.image.url() : null,
      link_url: hasLink ? faker.internet.url() : null,
      likes_count: 0,
      comments_count: 0,
      shares_count: 0,
      created_at: faker.date.past(),
      updated_at: faker.date.recent()
    };
  }),

  comments: (users, posts) => Array.from({ length: 200 }, () => ({
    id: faker.string.uuid(),
    post_id: faker.helpers.arrayElement(posts).id,
    author_id: faker.helpers.arrayElement(users).id,
    content: faker.lorem.paragraph(),
    parent_id: null,
    created_at: faker.date.past(),
    updated_at: faker.date.recent()
  })),

  likes: (users, posts) => Array.from({ length: 300 }, () => ({
    id: faker.string.uuid(),
    post_id: faker.helpers.arrayElement(posts).id,
    user_id: faker.helpers.arrayElement(users).id,
    created_at: faker.date.past()
  })),

  bookmarks: (users, posts) => Array.from({ length: 100 }, () => ({
    id: faker.string.uuid(),
    post_id: faker.helpers.arrayElement(posts).id,
    user_id: faker.helpers.arrayElement(users).id,
    created_at: faker.date.past()
  })),

  financial_transactions: (users, projects) => Array.from({ length: 50 }, () => ({
    id: faker.string.uuid(),
    project_id: faker.helpers.arrayElement(projects).id,
    user_id: faker.helpers.arrayElement(users).id,
    type: faker.helpers.arrayElement(['investment', 'withdrawal', 'fee']),
    amount: faker.number.float({ min: 100, max: 10000, precision: 0.01 }),
    currency: 'USD',
    status: faker.helpers.arrayElement(['completed', 'pending', 'failed']),
    created_at: faker.date.past()
  })),

  notifications: (users, posts, projects) => Array.from({ length: 100 }, () => {
    const type = faker.helpers.arrayElement(['like', 'comment', 'follow', 'project_invite']);
    const relatedUser = faker.helpers.arrayElement(users);
    const post = type === 'like' || type === 'comment' ? faker.helpers.arrayElement(posts) : null;
    const project = type === 'project_invite' ? faker.helpers.arrayElement(projects) : null;
    
    return {
      id: faker.string.uuid(),
      user_id: faker.helpers.arrayElement(users).id,
      type,
      content: `${relatedUser.email} ${type === 'like' ? 'liked' : type === 'comment' ? 'commented on' : type === 'follow' ? 'followed' : 'invited you to'} ${type === 'project_invite' ? 'a project' : 'your post'}`,
      read: faker.datatype.boolean(),
      related_user_id: relatedUser.id,
      related_post_id: post?.id || null,
      related_project_id: project?.id || null,
      created_at: faker.date.recent()
    };
  }),

  connections: (users) => Array.from({ length: 50 }, () => {
    const [follower, following] = faker.helpers.arrayElements(users, 2);
    return {
      id: faker.string.uuid(),
      follower_id: follower.id,
      following_id: following.id,
      status: faker.helpers.arrayElement(['accepted', 'pending']),
      created_at: faker.date.past()
    };
  })
};

async function seedDatabase() {
  try {
    // Create test users
    console.log('Creating test users...');
    const users = await createTestUsers();
    console.log('Created users:', users);
    if (!users.length) throw new Error('Failed to create test users');

    // Create user profiles
    console.log('Creating user profiles...');
    const profiles = SEED_DATA.profiles(users);
    console.log('Profiles to create:', profiles);
    
    for (const profile of profiles) {
      const { data: existingProfile, error: checkError } = await supabase.from('user_profiles').select().eq('id', profile.id);

      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 means no rows returned
        console.error('Error checking profile:', checkError);
        throw checkError;
      }

      if (existingProfile?.length > 0) {
        console.log(`Updating profile for user ${profile.id}...`);
        const { error: updateError } = await supabase.from('user_profiles').update(profile).eq('id', profile.id);

        if (updateError) {
          console.error('Error updating profile:', updateError);
          throw updateError;
        }
      } else {
        console.log(`Creating profile for user ${profile.id}...`);
        const { error: insertError } = await supabase.from('user_profiles').insert(profile);

        if (insertError) {
          console.error('Error creating profile:', insertError);
          throw insertError;
        }
      }
    }

    // Create projects
    console.log('Creating projects...');
    const projects = SEED_DATA.projects(users);
    
    for (const project of projects) {
      const { data: existingProject, error: checkError } = await supabase.from('projects').select().eq('id', project.id);

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking project:', checkError);
        throw checkError;
      }

      if (existingProject?.length > 0) {
        console.log(`Updating project ${project.id}...`);
        const { error: updateError } = await supabase.from('projects').update(project).eq('id', project.id);

        if (updateError) {
          console.error('Error updating project:', updateError);
          throw updateError;
        }
      } else {
        console.log(`Creating project ${project.id}...`);
        const { error: insertError } = await supabase.from('projects').insert(project);

        if (insertError) {
          console.error('Error creating project:', insertError);
          throw insertError;
        }
      }
    }

    // Create team members
    console.log('Creating team members...');
    const teamMembers = SEED_DATA.team_members(users, projects);
    
    for (const member of teamMembers) {
      const { data: existingMember, error: checkError } = await supabase.from('team_members').select().eq('id', member.id);

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking team member:', checkError);
        throw checkError;
      }

      if (existingMember?.length > 0) {
        console.log(`Updating team member ${member.id}...`);
        const { error: updateError } = await supabase.from('team_members').update(member).eq('id', member.id);

        if (updateError) {
          console.error('Error updating team member:', updateError);
          throw updateError;
        }
      } else {
        console.log(`Creating team member ${member.id}...`);
        const { error: insertError } = await supabase.from('team_members').insert(member);

        if (insertError) {
          console.error('Error creating team member:', insertError);
          throw insertError;
        }
      }
    }

    // Create posts
    console.log('Creating posts...');
    const posts = SEED_DATA.posts(users);
    
    for (const post of posts) {
      const { data: existingPost, error: checkError } = await supabase.from('posts').select().eq('id', post.id);

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking post:', checkError);
        throw checkError;
      }

      if (existingPost?.length > 0) {
        console.log(`Updating post ${post.id}...`);
        const { error: updateError } = await supabase.from('posts').update(post).eq('id', post.id);

        if (updateError) {
          console.error('Error updating post:', updateError);
          throw updateError;
        }
      } else {
        console.log(`Creating post ${post.id}...`);
        const { error: insertError } = await supabase.from('posts').insert(post);

        if (insertError) {
          console.error('Error creating post:', insertError);
          throw insertError;
        }
      }
    }

    // Create comments
    console.log('Creating comments...');
    const comments = SEED_DATA.comments(users, posts);
    
    for (const comment of comments) {
      const { data: existingComment, error: checkError } = await supabase.from('comments').select().eq('id', comment.id);

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking comment:', checkError);
        throw checkError;
      }

      if (existingComment?.length > 0) {
        console.log(`Updating comment ${comment.id}...`);
        const { error: updateError } = await supabase.from('comments').update(comment).eq('id', comment.id);

        if (updateError) {
          console.error('Error updating comment:', updateError);
          throw updateError;
        }
      } else {
        console.log(`Creating comment ${comment.id}...`);
        const { error: insertError } = await supabase.from('comments').insert(comment);

        if (insertError) {
          console.error('Error creating comment:', insertError);
          throw insertError;
        }
      }
    }

    // Create likes
    console.log('Creating likes...');
    const likes = SEED_DATA.likes(users, posts);
    
    for (const like of likes) {
      const { data: existingLike, error: checkError } = await supabase.from('likes').select().eq('id', like.id);

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking like:', checkError);
        throw checkError;
      }

      if (existingLike?.length > 0) {
        console.log(`Updating like ${like.id}...`);
        const { error: updateError } = await supabase.from('likes').update(like).eq('id', like.id);

        if (updateError) {
          console.error('Error updating like:', updateError);
          throw updateError;
        }
      } else {
        console.log(`Creating like ${like.id}...`);
        const { error: insertError } = await supabase.from('likes').insert(like);

        if (insertError) {
          console.error('Error creating like:', insertError);
          throw insertError;
        }
      }
    }

    // Create bookmarks
    console.log('Creating bookmarks...');
    const bookmarks = SEED_DATA.bookmarks(users, posts);
    
    for (const bookmark of bookmarks) {
      const { data: existingBookmark, error: checkError } = await supabase.from('bookmarks').select().eq('id', bookmark.id);

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking bookmark:', checkError);
        throw checkError;
      }

      if (existingBookmark?.length > 0) {
        console.log(`Updating bookmark ${bookmark.id}...`);
        const { error: updateError } = await supabase.from('bookmarks').update(bookmark).eq('id', bookmark.id);

        if (updateError) {
          console.error('Error updating bookmark:', updateError);
          throw updateError;
        }
      } else {
        console.log(`Creating bookmark ${bookmark.id}...`);
        const { error: insertError } = await supabase.from('bookmarks').insert(bookmark);

        if (insertError) {
          console.error('Error creating bookmark:', insertError);
          throw insertError;
        }
      }
    }

    // Create financial transactions
    console.log('Creating financial transactions...');
    const transactions = SEED_DATA.financial_transactions(users, projects);
    
    for (const transaction of transactions) {
      const { data: existingTransaction, error: checkError } = await supabase.from('financial_transactions').select().eq('id', transaction.id);

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking transaction:', checkError);
        throw checkError;
      }

      if (existingTransaction?.length > 0) {
        console.log(`Updating transaction ${transaction.id}...`);
        const { error: updateError } = await supabase.from('financial_transactions').update(transaction).eq('id', transaction.id);

        if (updateError) {
          console.error('Error updating transaction:', updateError);
          throw updateError;
        }
      } else {
        console.log(`Creating transaction ${transaction.id}...`);
        const { error: insertError } = await supabase.from('financial_transactions').insert(transaction);

        if (insertError) {
          console.error('Error creating transaction:', insertError);
          throw insertError;
        }
      }
    }

    // Create notifications
    console.log('Creating notifications...');
    const notifications = SEED_DATA.notifications(users, posts, projects);
    
    for (const notification of notifications) {
      const { data: existingNotification, error: checkError } = await supabase.from('notifications').select().eq('id', notification.id);

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking notification:', checkError);
        throw checkError;
      }

      if (existingNotification?.length > 0) {
        console.log(`Updating notification ${notification.id}...`);
        const { error: updateError } = await supabase.from('notifications').update(notification).eq('id', notification.id);

        if (updateError) {
          console.error('Error updating notification:', updateError);
          throw updateError;
        }
      } else {
        console.log(`Creating notification ${notification.id}...`);
        const { error: insertError } = await supabase.from('notifications').insert(notification);

        if (insertError) {
          console.error('Error creating notification:', insertError);
          throw insertError;
        }
      }
    }

    // Create connections
    console.log('Creating connections...');
    const connections = SEED_DATA.connections(users);
    
    for (const connection of connections) {
      const { data: existingConnection, error: checkError } = await supabase.from('connections').select().eq('id', connection.id);

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking connection:', checkError);
        throw checkError;
      }

      if (existingConnection?.length > 0) {
        console.log(`Updating connection ${connection.id}...`);
        const { error: updateError } = await supabase.from('connections').update(connection).eq('id', connection.id);

        if (updateError) {
          console.error('Error updating connection:', updateError);
          throw updateError;
        }
      } else {
        console.log(`Creating connection ${connection.id}...`);
        const { error: insertError } = await supabase.from('connections').insert(connection);

        if (insertError) {
          console.error('Error creating connection:', insertError);
          throw insertError;
        }
      }
    }

    // Update post counts
    console.log('Updating post counts...');
    for (const post of posts) {
      const likesCount = likes.filter(l => l.post_id === post.id).length;
      const commentsCount = comments.filter(c => c.post_id === post.id).length;
      
      const { error: updateError } = await supabase.from('posts').update({ 
        likes_count: likesCount,
        comments_count: commentsCount
      }).eq('id', post.id);
      
      if (updateError) {
        console.error('Error updating post counts:', updateError);
        throw updateError;
      }
    }

    console.log('Seed completed successfully');
    return { users };
  } catch (error) {
    console.error('Seed error:', error);
    throw error;
  }
}

seedDatabase()
  .then(result => {
    console.log('Database seeded successfully!', result);
    process.exit(0);
  })
  .catch(error => {
    console.error('Error seeding database:', error);
    process.exit(1);
  });
