// ============================================================
// PROJECTS
// Add, remove, edit, or reorder projects in this one file.
//
// IMAGE INSTRUCTIONS:
// 1. Create this folder if needed: public/project-images
// 2. Place your images inside that folder.
// 3. Set image to: '/project-images/your-image-name.webp'
// 4. Leave image as '' to use the colored letter design instead.
// ============================================================

export const projects = [
  {
    id: '01',
    slug: 'pollen',
    name: 'Pollen',
    discipline: 'Product / Development',
    year: '2026',
    summary:
      'A focused planning space for small teams that turns scattered ideas into clear weekly momentum.',
    tools: ['React', 'Product design', 'Node.js'],
    tone: 'lime',

    // Example: '/project-images/pollen.webp'
    image: '',
    imageAlt: 'Pollen project preview',

    overview:
      'Pollen gives small teams one calm place to collect ideas, choose priorities, and understand what should happen next.',
    challenge:
      'Existing planning tools felt too complex for lightweight collaboration and required teams to maintain the tool instead of doing the work.',
    solution:
      'I designed a focused weekly workflow, a flexible task system, and a clear progress view, then built the product as a responsive full-stack application.',
    highlights: ['Responsive team dashboard', 'Weekly planning workflow', 'Role-based collaboration'],
    liveUrl: '',
    githubUrl: '',

    // Add your live website, GitHub repository, or case-study link.
  },
  {
    id: '02',
    slug: 'kanso',
    name: 'Kanso',
    discipline: 'Identity / Commerce',
    year: '2025',
    summary:
      'A quiet digital flagship for a furniture studio built around honest materials and considered details.',
    tools: ['Art direction', 'Next.js', 'CMS'],
    tone: 'clay',

    // Example: '/project-images/kanso.webp'
    image: '',
    imageAlt: 'Kanso project preview',

    overview:
      'Kanso is a refined commerce experience that lets the materials and craftsmanship of each furniture piece lead the story.',
    challenge:
      'The studio needed an online store that felt editorial and premium without making product discovery or purchasing difficult.',
    solution:
      'I created a restrained design system, flexible editorial layouts, and a fast product experience supported by an easy-to-manage CMS.',
    highlights: ['Editorial product pages', 'Responsive commerce flow', 'Flexible content management'],
    liveUrl: '',
    githubUrl: '',

  },
  {
    id: '03',
    slug: 'common-ground',
    name: 'Common Ground',
    discipline: 'Strategy / Platform',
    year: '2025',
    summary:
      'A flexible identity and community platform designed to bring good people and useful ideas together.',
    tools: ['Strategy', 'UI design', 'React'],
    tone: 'blue',

    // Example: '/project-images/common-ground.webp'
    image: '',
    imageAlt: 'Common Ground project preview',

    overview:
      'Common Ground connects people around useful events, shared interests, and community-led ideas.',
    challenge:
      'The organization needed one flexible platform that could serve different communities while maintaining a recognizable identity.',
    solution:
      'I developed a modular identity and component system that adapts to events, articles, profiles, and community initiatives.',
    highlights: ['Modular visual system', 'Community event discovery', 'Accessible responsive interface'],
    liveUrl: '',
    githubUrl: '',

  },
]
