export const megaMenus = {
  Shop: {
    title: "Shop",
    columns: [
      {
        heading: "Photography",
        items: [
          { name: "Nature", href: "/shop/nature" },
          { name: "Wildlife", href: "/shop/wildlife" },
          { name: "Travel", href: "/shop/travel" },
          { name: "Architecture", href: "/shop/architecture" },
          { name: "Street", href: "/shop/street" },
        ],
      },
      {
        heading: "Paintings",
        items: [
          { name: "Abstract", href: "/shop/abstract" },
          { name: "Modern", href: "/shop/modern" },
          { name: "Minimal", href: "/shop/minimal" },
          { name: "Contemporary", href: "/shop/contemporary" },
        ],
      },
      {
        heading: "Collections",
        items: [
          { name: "New Arrivals", href: "/collections/new" },
          { name: "Best Sellers", href: "/collections/best" },
          { name: "Editor's Choice", href: "/collections/editors-choice" },
          { name: "Limited Edition", href: "/collections/limited" },
        ],
      },
      {
        heading: "Services",
        items: [
          { name: "Custom Framing", href: "/services/framing" },
          { name: "Interior Styling", href: "/services/interior" },
          { name: "Corporate Art", href: "/services/corporate" },
        ],
      },
    ],
    featured: {
      image: "/images/mega-menu/shop.jpg",
      title: "Discover Fine Art",
      description:
        "Museum-quality photography and paintings for homes and offices.",
      button: "Shop Collection",
      href: "/shop",
    },
  },

  Collections: {
    title: "Collections",
    columns: [
      {
        heading: "Nature",
        items: [
          { name: "Mountains", href: "/collections/mountains" },
          { name: "Forests", href: "/collections/forests" },
          { name: "Ocean", href: "/collections/ocean" },
        ],
      },
      {
        heading: "Travel",
        items: [
          { name: "Europe", href: "/collections/europe" },
          { name: "Asia", href: "/collections/asia" },
          { name: "Africa", href: "/collections/africa" },
        ],
      },
      {
        heading: "Themes",
        items: [
          { name: "Minimal", href: "/collections/minimal" },
          { name: "Luxury", href: "/collections/luxury" },
          { name: "Black & White", href: "/collections/bw" },
        ],
      },
      {
        heading: "Featured",
        items: [
          { name: "Editor's Picks", href: "/collections/editors" },
          { name: "Trending", href: "/collections/trending" },
        ],
      },
    ],
    featured: {
      image: "/images/mega-menu/collections.jpg",
      title: "Curated Collections",
      description: "Browse hand-picked artwork for every style.",
      button: "View Collections",
      href: "/collections",
    },
  },

  Artists: {
    title: "Artists",
    columns: [
      {
        heading: "Featured Artists",
        items: [
          { name: "Joan Karle", href: "/artists/joan-karle" },
          { name: "Emerging Artists", href: "/artists/emerging" },
          { name: "Guest Artists", href: "/artists/guest" },
        ],
      },
      {
        heading: "Browse",
        items: [
          { name: "Photography", href: "/artists/photography" },
          { name: "Painting", href: "/artists/painting" },
          { name: "Digital Art", href: "/artists/digital" },
        ],
      },
      {
        heading: "Discover",
        items: [
          { name: "Artist Stories", href: "/artists/stories" },
          { name: "Interviews", href: "/artists/interviews" },
        ],
      },
      {
        heading: "More",
        items: [
          { name: "All Artists", href: "/artists" },
        ],
      },
    ],
    featured: {
      image: "/images/mega-menu/artists.jpg",
      title: "Meet Our Artists",
      description: "Explore the creative minds behind every masterpiece.",
      button: "Explore Artists",
      href: "/artists",
    },
  },

  Services: {
    title: "Services",
    columns: [
      {
        heading: "Gallery Services",
        items: [
          { name: "Custom Framing", href: "/services/framing" },
          { name: "Art Installation", href: "/services/installation" },
          { name: "Art Consultation", href: "/services/consultation" },
        ],
      },
      {
        heading: "Business",
        items: [
          { name: "Corporate Projects", href: "/services/corporate" },
          { name: "Hotels", href: "/services/hospitality" },
          { name: "Interior Designers", href: "/services/designers" },
        ],
      },
      {
        heading: "Printing",
        items: [
          { name: "Canvas Prints", href: "/services/canvas" },
          { name: "Photo Prints", href: "/services/photo-print" },
        ],
      },
      {
        heading: "Support",
        items: [
          { name: "FAQs", href: "/faq" },
        ],
      },
    ],
    featured: {
      image: "/images/mega-menu/services.jpg",
      title: "Professional Art Services",
      description: "From framing to installation, we help bring your vision to life.",
      button: "Our Services",
      href: "/services",
    },
  },

  Inspiration: {
    title: "Inspiration",
    columns: [
      {
        heading: "Ideas",
        items: [
          { name: "Living Room", href: "/inspiration/living-room" },
          { name: "Bedroom", href: "/inspiration/bedroom" },
          { name: "Office", href: "/inspiration/office" },
        ],
      },
      {
        heading: "Guides",
        items: [
          { name: "Frame Guide", href: "/guides/frame" },
          { name: "Size Guide", href: "/guides/size" },
          { name: "Gallery Walls", href: "/guides/gallery-wall" },
        ],
      },
      {
        heading: "Stories",
        items: [
          { name: "Photography", href: "/stories/photography" },
          { name: "Travel", href: "/stories/travel" },
        ],
      },
      {
        heading: "Latest",
        items: [
          { name: "Blog", href: "/blog" },
        ],
      },
    ],
    featured: {
      image: "/images/mega-menu/inspiration.jpg",
      title: "Find Inspiration",
      description: "Ideas and stories to help you choose the perfect artwork.",
      button: "Explore",
      href: "/inspiration",
    },
  },
};