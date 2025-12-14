export interface ShowcaseItem {
  id: number;
  slug: string;
  title: string;
  type: string;
  description: string;
  gradient: string;
  year: string;
  tools: string[];
  images: string[];
}

export const showcaseItems: ShowcaseItem[] = [
  {
    id: 1,
    slug: "brand-identity-design",
    title: "Brand Identity Design",
    type: "Branding",
    description:
      "Complete brand identity system including logo design, color palette, typography, and brand guidelines for a tech startup focused on sustainable solutions.",
    gradient: "from-[#ff6b35] to-[#f7931e]",
    year: "2024",
    tools: ["Figma", "Illustrator", "After Effects"],
    images: [
      "linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)",
      "linear-gradient(135deg, #f7931e 0%, #ff6b35 100%)",
      "linear-gradient(135deg, #ff9a56 0%, #ff6b35 100%)",
    ],
  },
  {
    id: 2,
    slug: "motion-graphics",
    title: "Motion Graphics",
    type: "Animation",
    description:
      "Dynamic motion graphics package for a product launch campaign, featuring fluid animations, kinetic typography, and brand-aligned visual storytelling.",
    gradient: "from-[#4ecdc4] to-[#44a08d]",
    year: "2024",
    tools: ["After Effects", "Cinema 4D", "Premiere Pro"],
    images: [
      "linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)",
      "linear-gradient(135deg, #44a08d 0%, #4ecdc4 100%)",
      "linear-gradient(135deg, #3db8b0 0%, #4ecdc4 100%)",
    ],
  },
  {
    id: 3,
    slug: "3d-visualization",
    title: "3D Visualization",
    type: "3D Design",
    description:
      "Photorealistic 3D product renders and architectural visualizations created for marketing campaigns and client presentations.",
    gradient: "from-[#667eea] to-[#764ba2]",
    year: "2023",
    tools: ["Blender", "Cinema 4D", "Octane Render"],
    images: [
      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
      "linear-gradient(135deg, #5a67d8 0%, #805ad5 100%)",
    ],
  },
  {
    id: 4,
    slug: "interactive-experience",
    title: "Interactive Experience",
    type: "WebGL",
    description:
      "Immersive WebGL experiences featuring particle systems, 3D environments, and real-time interactions built for web browsers.",
    gradient: "from-[#f093fb] to-[#f5576c]",
    year: "2024",
    tools: ["Three.js", "GSAP", "WebGL", "Shaders"],
    images: [
      "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      "linear-gradient(135deg, #f5576c 0%, #f093fb 100%)",
      "linear-gradient(135deg, #eb3349 0%, #f45c43 100%)",
    ],
  },
  {
    id: 5,
    slug: "product-photography",
    title: "Product Photography",
    type: "Photography",
    description:
      "High-end product photography and post-production for e-commerce and advertising campaigns, emphasizing clean aesthetics and attention to detail.",
    gradient: "from-[#4facfe] to-[#00f2fe]",
    year: "2023",
    tools: ["Lightroom", "Photoshop", "Capture One"],
    images: [
      "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      "linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)",
      "linear-gradient(135deg, #0083B0 0%, #00B4DB 100%)",
    ],
  },
  {
    id: 6,
    slug: "ui-components",
    title: "UI Components",
    type: "Design System",
    description:
      "Comprehensive UI component library and design system featuring accessible, responsive components with detailed documentation.",
    gradient: "from-[#43e97b] to-[#38f9d7]",
    year: "2024",
    tools: ["Figma", "Storybook", "React", "TypeScript"],
    images: [
      "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
      "linear-gradient(135deg, #38f9d7 0%, #43e97b 100%)",
      "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
    ],
  },
  {
    id: 7,
    slug: "digital-illustrations",
    title: "Digital Illustrations",
    type: "Illustration",
    description:
      "Custom digital illustrations for editorial, marketing, and product design, combining traditional techniques with digital tools.",
    gradient: "from-[#fa709a] to-[#fee140]",
    year: "2023",
    tools: ["Procreate", "Photoshop", "Illustrator"],
    images: [
      "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
      "linear-gradient(135deg, #fee140 0%, #fa709a 100%)",
      "linear-gradient(135deg, #f7971e 0%, #ffd200 100%)",
    ],
  },
  {
    id: 8,
    slug: "app-icons",
    title: "App Icons",
    type: "Icon Design",
    description:
      "Distinctive app icon designs for iOS and Android applications, optimized for various sizes and platforms.",
    gradient: "from-[#a18cd1] to-[#fbc2eb]",
    year: "2024",
    tools: ["Figma", "Illustrator", "Sketch"],
    images: [
      "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
      "linear-gradient(135deg, #fbc2eb 0%, #a18cd1 100%)",
      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    ],
  },
];

export function getShowcaseBySlug(slug: string): ShowcaseItem | undefined {
  return showcaseItems.find((item) => item.slug === slug);
}

export function getAllShowcaseSlugs(): string[] {
  return showcaseItems.map((item) => item.slug);
}

