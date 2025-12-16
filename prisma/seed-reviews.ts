import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const sampleReviews = [
  {
    customerName: 'Sarah Johnson',
    customerEmail: 'sarah.j@email.com',
    rating: 5,
    title: 'Excellent laptop for everyday use!',
    comment: 'I purchased the MacBook Air M1 a month ago and I am absolutely thrilled with it. The performance is incredible, the battery life lasts all day, and the build quality is top-notch. Perfect for work and casual browsing. Highly recommend!',
    images: [
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800',
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800',
    ],
    verifiedPurchase: true,
    helpful: 23,
  },
  {
    customerName: 'Michael Chen',
    customerEmail: 'mchen@email.com',
    rating: 5,
    title: 'Best laptop I have ever owned',
    comment: 'The M1 chip is a game changer. Everything runs smoothly and efficiently. The laptop stays cool even during intensive tasks. The screen is gorgeous and the speakers are surprisingly good for a laptop this thin. Worth every penny!',
    images: [],
    verifiedPurchase: true,
    helpful: 15,
  },
  {
    customerName: 'Emily Rodriguez',
    customerEmail: 'emily.r@email.com',
    rating: 4,
    title: 'Great performance, minor issues',
    comment: 'Overall a fantastic laptop. The M1 chip performs excellently and battery life is amazing. My only gripe is that some older software still has compatibility issues, but Apple is working on that. Still highly recommend for most users.',
    images: ['https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=800'],
    verifiedPurchase: true,
    helpful: 8,
  },
  {
    customerName: 'David Thompson',
    customerEmail: null,
    rating: 5,
    title: 'Perfect for students',
    comment: 'As a university student, this laptop is perfect for my needs. It handles all my coursework, video calls, and entertainment without breaking a sweat. The portability is excellent and I can go all day without charging.',
    images: [],
    verifiedPurchase: false,
    helpful: 12,
  },
  {
    customerName: 'Lisa Wang',
    customerEmail: 'lisa.wang@email.com',
    rating: 4,
    title: 'Solid business laptop',
    comment: 'The Dell Vostro 3530 is a reliable workhorse. Good keyboard for typing long documents, decent performance for office work. The build is sturdy, though it is a bit heavy. Good value for money for business use.',
    images: [],
    verifiedPurchase: true,
    helpful: 6,
  },
  {
    customerName: 'James Wilson',
    customerEmail: 'j.wilson@email.com',
    rating: 3,
    title: 'Decent but not exceptional',
    comment: 'The laptop does what it needs to do for basic office tasks. Performance is adequate but nothing special. The screen could be brighter and the battery life is just okay. It is a decent budget option.',
    images: [],
    verifiedPurchase: true,
    helpful: 3,
  },
  {
    customerName: 'Amanda Foster',
    customerEmail: 'amanda.f@email.com',
    rating: 5,
    title: 'Love this phone!',
    comment: 'Upgraded from iPhone 12 and the difference is amazing! The camera quality is incredible, especially in low light. The battery lasts all day with heavy use. Face ID is lightning fast. Best phone I have ever owned!',
    images: [
      'https://images.unsplash.com/photo-1632633173522-c81f67bb6566?w=800',
      'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=800',
    ],
    verifiedPurchase: true,
    helpful: 42,
  },
  {
    customerName: 'Robert Martinez',
    customerEmail: 'r.martinez@email.com',
    rating: 5,
    title: 'iPhone 14 Pro Max - Top tier flagship',
    comment: 'This phone is absolutely phenomenal. The Dynamic Island is a brilliant feature, the cameras are professional-grade, and the performance is buttery smooth. The battery life easily gets me through a full day of heavy use. Cannot recommend enough!',
    images: ['https://images.unsplash.com/photo-1592286927405-ed7f365bb28e?w=800'],
    verifiedPurchase: true,
    helpful: 38,
  },
  {
    customerName: 'Jennifer Lee',
    customerEmail: null,
    rating: 4,
    title: 'Great phone, pricey though',
    comment: 'The iPhone 14 Pro Max is an excellent phone with top-notch features. Camera is outstanding, display is beautiful, and performance is flawless. Only downside is the price tag - it is quite expensive. But if you can afford it, it is worth it.',
    images: [],
    verifiedPurchase: false,
    helpful: 19,
  },
  {
    customerName: 'Christopher Brown',
    customerEmail: 'chris.b@email.com',
    rating: 5,
    title: 'Best Android phone on the market',
    comment: 'Switched from iPhone and do not regret it. The Galaxy S23 Ultra has an amazing display, the S Pen is incredibly useful, and the camera system is versatile. Battery life is excellent and the customization options are endless.',
    images: ['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800'],
    verifiedPurchase: true,
    helpful: 27,
  },
  {
    customerName: 'Rachel Green',
    customerEmail: 'rachel.g@email.com',
    rating: 4,
    title: 'Powerful phone with great features',
    comment: 'The S23 Ultra is a powerhouse. Camera quality is fantastic, especially the zoom capabilities. The screen is gorgeous and the S Pen adds great functionality. Only complaint is it is quite large and can be hard to use with one hand.',
    images: [],
    verifiedPurchase: true,
    helpful: 14,
  },
  {
    customerName: 'Daniel Kim',
    customerEmail: 'dan.kim@email.com',
    rating: 5,
    title: 'Gaming beast!',
    comment: 'This laptop is a gaming monster. Running all latest games on ultra settings with high FPS. The cooling system keeps it cool under load. RGB lighting is customizable and looks sick. Screen refresh rate is butter smooth. Absolutely love it!',
    images: [
      'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800',
      'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800',
    ],
    verifiedPurchase: true,
    helpful: 51,
  },
  {
    customerName: 'Victoria Adams',
    customerEmail: null,
    rating: 4,
    title: 'Great performance, a bit noisy',
    comment: 'Fantastic gaming laptop with excellent performance. Handles all modern games with ease. The only downside is the fans can get quite loud during intense gaming sessions. But for the price and performance, it is a great deal.',
    images: [],
    verifiedPurchase: false,
    helpful: 22,
  },
  {
    customerName: 'Thomas Anderson',
    customerEmail: 't.anderson@email.com',
    rating: 5,
    title: 'Best monitor for productivity',
    comment: 'This ultrawide monitor has transformed my workflow. Having so much horizontal space means I can have multiple windows open side by side. The picture quality is excellent and the stand is sturdy. Perfect for coding and multitasking.',
    images: ['https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800'],
    verifiedPurchase: true,
    helpful: 18,
  },
  {
    customerName: 'Sophia Martinez',
    customerEmail: 's.martinez@email.com',
    rating: 5,
    title: 'Amazing noise cancellation',
    comment: 'These headphones are incredible! The noise cancellation is the best I have experienced - completely blocks out airplane noise. Sound quality is excellent, comfortable for long wearing sessions. Battery life easily lasts through multiple flights.',
    images: ['https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=800'],
    verifiedPurchase: true,
    helpful: 35,
  },
  {
    customerName: 'Oliver Jackson',
    customerEmail: 'oliver.j@email.com',
    rating: 4,
    title: 'Great sound, bit pricey',
    comment: 'The Sony WH-1000XM5 headphones deliver exceptional audio quality and industry-leading noise cancellation. Very comfortable for extended use. They are expensive, but the quality justifies the price if you travel frequently or need excellent noise cancellation.',
    images: [],
    verifiedPurchase: true,
    helpful: 11,
  },
  {
    customerName: 'Isabella Rodriguez',
    customerEmail: null,
    rating: 5,
    title: 'Perfect smart watch',
    comment: 'The Apple Watch Series 8 is the perfect companion to my iPhone. Fitness tracking is accurate, notifications are handy, and the battery lasts all day. The always-on display is very convenient. Love the health features and workout tracking.',
    images: [],
    verifiedPurchase: false,
    helpful: 16,
  },
  {
    customerName: 'Ethan Williams',
    customerEmail: 'ethan.w@email.com',
    rating: 5,
    title: 'Best mechanical keyboard',
    comment: 'This keyboard is a joy to type on. The Logitech MX Mechanical switches feel great and are not too loud. Build quality is premium, wireless connectivity is rock solid, and battery life is excellent. Worth every cent for someone who types all day.',
    images: ['https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800'],
    verifiedPurchase: true,
    helpful: 29,
  },
  {
    customerName: 'Mia Johnson',
    customerEmail: 'mia.j@email.com',
    rating: 4,
    title: 'Excellent webcam quality',
    comment: 'The Logitech Brio 4K webcam provides crystal clear video quality for video calls. Auto-focus and auto-light correction work great. Price is a bit steep but if you do a lot of video conferencing, it is worth the investment. Much better than laptop webcams.',
    images: [],
    verifiedPurchase: true,
    helpful: 7,
  },
  {
    customerName: 'Alexander Brown',
    customerEmail: 'alex.brown@email.com',
    rating: 5,
    title: 'Best ergonomic mouse',
    comment: 'After switching to the Logitech MX Master 3S, I will never go back to a regular mouse. The ergonomics are perfect, my wrist pain is gone. The scroll wheel is amazing and the customizable buttons boost productivity. A must-have for office workers.',
    images: [],
    verifiedPurchase: true,
    helpful: 31,
  },
];

async function seedReviews() {
  console.log('Starting to seed reviews...');

  try {
    // Get all products
    const products = await prisma.product.findMany({
      select: { id: true, name: true },
    });

    if (products.length === 0) {
      console.log('No products found. Please seed products first.');
      return;
    }

    console.log(`Found ${products.length} products in database.`);

    // Map product names to IDs for easier assignment
    const productMap: { [key: string]: string } = {};
    products.forEach((p) => {
      productMap[p.name] = p.id;
    });

    // Assign reviews to specific products based on product name keywords
    const reviewAssignments = [
      { keywords: ['macbook', 'air', 'm1'], reviewIndexes: [0, 1, 2, 3] },
      { keywords: ['dell', 'vostro'], reviewIndexes: [4, 5] },
      { keywords: ['iphone', '14', 'pro', 'max'], reviewIndexes: [6, 7, 8] },
      { keywords: ['samsung', 'galaxy', 's23', 'ultra'], reviewIndexes: [9, 10] },
      { keywords: ['gaming', 'laptop', 'asus', 'rog', 'legion'], reviewIndexes: [11, 12] },
      { keywords: ['monitor', 'ultrawide', 'lg'], reviewIndexes: [13] },
      { keywords: ['sony', 'wh-1000xm5', 'headphone'], reviewIndexes: [14, 15] },
      { keywords: ['apple', 'watch'], reviewIndexes: [16] },
      { keywords: ['logitech', 'keyboard', 'mx', 'mechanical'], reviewIndexes: [17] },
      { keywords: ['webcam', 'brio', '4k'], reviewIndexes: [18] },
      { keywords: ['mouse', 'mx', 'master'], reviewIndexes: [19] },
    ];

    let createdCount = 0;

    for (const assignment of reviewAssignments) {
      // Find matching product
      const matchingProduct = products.find((p) =>
        assignment.keywords.some((keyword) =>
          p.name.toLowerCase().includes(keyword.toLowerCase())
        )
      );

      if (!matchingProduct) {
        console.log(`No product found for keywords: ${assignment.keywords.join(', ')}`);
        continue;
      }

      // Create reviews for this product
      for (const index of assignment.reviewIndexes) {
        const reviewData = sampleReviews[index];
        if (!reviewData) continue;

        await prisma.review.create({
          data: {
            ...reviewData,
            productId: matchingProduct.id,
          },
        });
        createdCount++;
        console.log(`Created review for ${matchingProduct.name} by ${reviewData.customerName}`);
      }

      // Update product rating based on reviews
      const stats = await prisma.review.aggregate({
        where: { productId: matchingProduct.id, approved: true },
        _avg: { rating: true },
      });

      await prisma.product.update({
        where: { id: matchingProduct.id },
        data: {
          rating: stats._avg.rating || 0,
        },
      });
    }

    console.log(`\n✅ Successfully created ${createdCount} reviews!`);
    console.log('Product ratings have been updated based on reviews.');
  } catch (error) {
    console.error('Error seeding reviews:', error);
    throw error;
  }
}

// Run the seed function
seedReviews()
  .then(() => {
    console.log('Review seeding completed!');
    prisma.$disconnect();
  })
  .catch((error) => {
    console.error('Review seeding failed:', error);
    prisma.$disconnect();
    process.exit(1);
  });
