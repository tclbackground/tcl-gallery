export type Blog = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string[];
  category: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
  featured?: boolean;
};

export const blogs: Blog[] = [
  {
    id: "1",
    title: "How to Choose Fine Art for Your Home",
    slug: "how-to-choose-fine-art-for-your-home",
    excerpt:
      "Discover how the right artwork can transform your living space and reflect your personal style.",
    category: "Art & Interiors",
    author: "TCL Gallery",
    date: "August 20, 2026",
    readTime: "5 min read",
    image: "/images/blog/choosing-art.jpg",
    featured: true,
    content: [
      "Choosing fine art for your home is about more than simply filling an empty wall. Artwork can influence the mood, character, and personality of an entire space.",

      "Begin by considering the atmosphere you want to create. Large-scale photography can create a dramatic focal point, while smaller artworks can add subtle layers of interest throughout a room.",

      "Consider the colour palette of your interior, but do not feel restricted to matching every colour. Artwork can also introduce contrast and create visual interest.",

      "The size of the artwork is equally important. A piece that is too small may get lost on a large wall, while a carefully selected large artwork can completely transform the space.",

      "At TCL Gallery, we believe that art should feel personal. Choose artwork that creates an emotional connection and that you will continue to enjoy over time.",
    ],
  },

  {
    id: "2",
    title: "The Art of Collecting Fine Art Photography",
    slug: "art-of-collecting-fine-art-photography",
    excerpt:
      "A guide to understanding editions, authenticity, and what makes fine art photography collectible.",
    category: "Fine Art",
    author: "TCL Gallery",
    date: "August 12, 2026",
    readTime: "6 min read",
    image: "/images/blog/fine-art-collecting.jpg",
    content: [
      "Fine art photography has become an important part of contemporary art collections around the world.",

      "When collecting photography, consider the artist, edition size, print quality, archival materials, and authenticity of the work.",

      "Limited editions can add exclusivity to a collection, while the artist's creative vision and body of work can provide deeper context to an individual photograph.",

      "A strong photography collection often develops over time. Collect pieces that resonate with you personally rather than simply following trends.",
    ],
  },

  {
    id: "3",
    title: "How Photography Can Transform Your Interior",
    slug: "how-photography-can-transform-your-interior",
    excerpt:
      "Explore how photography can create atmosphere, scale, and personality within your living or working space.",
    category: "Photography",
    author: "TCL Gallery",
    date: "August 5, 2026",
    readTime: "4 min read",
    image: "/images/blog/photography-home.jpg",
    content: [
      "Photography has the ability to capture moments, landscapes, people, and stories in a way that can transform an interior.",

      "Large-scale photographic artwork can become the visual centre of a room, while carefully arranged smaller works can create a gallery wall with a more personal character.",

      "Consider the relationship between the artwork and its surroundings. Lighting, framing, wall colour, and furniture all contribute to how a photograph is experienced.",
    ],
  },

  {
    id: "4",
    title: "Choosing the Right Frame for Your Artwork",
    slug: "choosing-the-right-frame-for-your-artwork",
    excerpt:
      "The right frame can protect your artwork while also enhancing its visual presence.",
    category: "Framing",
    author: "TCL Gallery",
    date: "July 28, 2026",
    readTime: "5 min read",
    image: "/images/blog/framing-art.jpg",
    content: [
      "A frame is more than a protective border. It plays an important role in how artwork is presented and experienced.",

      "Minimal frames can create a contemporary appearance, while natural wood or more detailed frames can add warmth and character.",

      "The frame should complement both the artwork and the space where it will be displayed.",
    ],
  },

  {
    id: "5",
    title: "Creating a Personal Art Collection",
    slug: "creating-a-personal-art-collection",
    excerpt:
      "Start building an art collection that reflects your personality, memories, and visual interests.",
    category: "Collecting",
    author: "TCL Gallery",
    date: "July 18, 2026",
    readTime: "7 min read",
    image: "/images/blog/gallery-interior.jpg",
    content: [
      "Building an art collection does not need to happen all at once. The most meaningful collections often grow gradually.",

      "Start with artworks that create a personal connection. Over time, you may begin to notice themes, subjects, colours, or artists that naturally connect your collection.",

      "Your collection should evolve with you and your space.",
    ],
  },
];

export function getBlogBySlug(slug: string) {
  return blogs.find((blog) => blog.slug === slug);
}

export function getFeaturedBlog() {
  return blogs.find((blog) => blog.featured);
}