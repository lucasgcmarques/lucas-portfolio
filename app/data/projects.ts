export interface Project {
  id: number;
  slug: string;
  title: string;
  category: string;
  description: string;
  fullDescription: string;
  image: string;
  tags: string[];
  year: string;
  client: string;
  role: string;
  liveUrl?: string;
  githubUrl?: string;
  features: string[];
  gallery: string[];
}

export const projects: Project[] = [
  {
    id: 1,
    slug: "e-commerce-platform",
    title: "E-Commerce Platform",
    category: "Web Development",
    description:
      "A modern e-commerce solution with seamless checkout experience and real-time inventory management.",
    fullDescription:
      "This comprehensive e-commerce platform was built to revolutionize online shopping experiences. It features a sleek, intuitive interface that guides users through product discovery to checkout seamlessly. The platform handles thousands of concurrent users while maintaining lightning-fast response times.",
    image: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    tags: ["Next.js", "Stripe", "PostgreSQL", "Redis", "Tailwind CSS"],
    year: "2024",
    client: "TechRetail Inc.",
    role: "Lead Developer",
    liveUrl: "https://example.com",
    githubUrl: "https://github.com",
    features: [
      "Real-time inventory tracking",
      "Multi-currency support",
      "Advanced search with filters",
      "Wishlist & favorites",
      "Order tracking system",
      "Admin dashboard",
    ],
    gallery: [
      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
      "linear-gradient(135deg, #5a67d8 0%, #805ad5 100%)",
    ],
  },
  {
    id: 2,
    slug: "finance-dashboard",
    title: "Finance Dashboard",
    category: "UI/UX Design",
    description:
      "Comprehensive financial analytics dashboard with interactive charts and real-time data visualization.",
    fullDescription:
      "A powerful financial analytics platform designed for enterprise clients. The dashboard provides real-time insights into market trends, portfolio performance, and risk analysis. Built with performance in mind, it handles complex data visualizations without compromising user experience.",
    image: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    tags: ["React", "D3.js", "TypeScript", "Node.js", "MongoDB"],
    year: "2024",
    client: "FinanceHub",
    role: "Full Stack Developer",
    liveUrl: "https://example.com",
    features: [
      "Real-time market data",
      "Interactive charts",
      "Portfolio analytics",
      "Risk assessment tools",
      "Export to PDF/Excel",
      "Dark/Light themes",
    ],
    gallery: [
      "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      "linear-gradient(135deg, #f5576c 0%, #f093fb 100%)",
      "linear-gradient(135deg, #eb3349 0%, #f45c43 100%)",
    ],
  },
  {
    id: 3,
    slug: "social-media-app",
    title: "Social Media App",
    category: "Mobile Development",
    description:
      "Feature-rich social platform with real-time messaging, stories, and content sharing capabilities.",
    fullDescription:
      "A next-generation social media application that connects people through shared interests and experiences. The app features innovative content discovery algorithms, real-time messaging, and seamless media sharing. Built for scale, it supports millions of daily active users.",
    image: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    tags: ["React Native", "Firebase", "Node.js", "Socket.io", "AWS"],
    year: "2023",
    client: "SocialConnect",
    role: "Mobile Developer",
    githubUrl: "https://github.com",
    features: [
      "Real-time messaging",
      "Stories & reels",
      "Content recommendations",
      "Live streaming",
      "Group chats",
      "Push notifications",
    ],
    gallery: [
      "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      "linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)",
      "linear-gradient(135deg, #0083B0 0%, #00B4DB 100%)",
    ],
  },
  {
    id: 4,
    slug: "ai-content-generator",
    title: "AI Content Generator",
    category: "Web Application",
    description:
      "Intelligent content creation tool powered by machine learning for marketing teams.",
    fullDescription:
      "An AI-powered content generation platform that helps marketing teams create compelling copy at scale. The tool leverages advanced language models to generate blog posts, social media content, email campaigns, and more. It learns from your brand voice to maintain consistency across all content.",
    image: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    tags: ["Python", "OpenAI", "Next.js", "FastAPI", "PostgreSQL"],
    year: "2024",
    client: "ContentAI",
    role: "AI Engineer",
    liveUrl: "https://example.com",
    features: [
      "AI-powered writing",
      "Brand voice training",
      "Multi-language support",
      "SEO optimization",
      "Content calendar",
      "Team collaboration",
    ],
    gallery: [
      "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
      "linear-gradient(135deg, #38f9d7 0%, #43e97b 100%)",
      "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
    ],
  },
  {
    id: 5,
    slug: "healthcare-portal",
    title: "Healthcare Portal",
    category: "Web Application",
    description:
      "Secure patient management system with telemedicine capabilities and appointment scheduling.",
    fullDescription:
      "A HIPAA-compliant healthcare portal that streamlines patient care and medical practice management. The platform features secure video consultations, automated appointment scheduling, electronic health records, and prescription management. Built with security as a priority.",
    image: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
    tags: ["Next.js", "TypeScript", "PostgreSQL", "WebRTC", "AWS"],
    year: "2023",
    client: "MediCare Plus",
    role: "Lead Developer",
    features: [
      "Video consultations",
      "Appointment scheduling",
      "E-prescriptions",
      "Health records",
      "Insurance integration",
      "Patient messaging",
    ],
    gallery: [
      "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
      "linear-gradient(135deg, #fed6e3 0%, #a8edea 100%)",
      "linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)",
    ],
  },
  {
    id: 6,
    slug: "real-estate-platform",
    title: "Real Estate Platform",
    category: "Web Development",
    description:
      "Property listing platform with virtual tours, advanced filtering, and mortgage calculator.",
    fullDescription:
      "A comprehensive real estate platform that transforms property search and transactions. Features include 360° virtual property tours, AI-powered property recommendations, and integrated mortgage calculations. The platform connects buyers, sellers, and agents in one seamless experience.",
    image: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
    tags: ["React", "Node.js", "MongoDB", "Three.js", "Mapbox"],
    year: "2024",
    client: "HomeQuest",
    role: "Full Stack Developer",
    liveUrl: "https://example.com",
    features: [
      "Virtual property tours",
      "Advanced search filters",
      "Mortgage calculator",
      "Agent matching",
      "Saved searches",
      "Market analytics",
    ],
    gallery: [
      "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
      "linear-gradient(135deg, #fcb69f 0%, #ffecd2 100%)",
      "linear-gradient(135deg, #f5af19 0%, #f12711 100%)",
    ],
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export function getAllProjectSlugs(): string[] {
  return projects.map((project) => project.slug);
}

