/**
 * Advanced SEO Configuration for CODEEX AI
 * Comprehensive SEO setup for Google indexing and social media sharing
 */

export interface SEOConfig {
  title: string;
  description: string;
  keywords: string[];
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
  locale?: string;
  alternateLocales?: string[];
}

export const defaultSEO: SEOConfig = {
  title: 'CODEEX AI - AI Learning Platform for Students | Voice-Enabled IDE with Jarvis Mode',
  description: 'Democratize tech learning with CODEEX AI - the magical AI learning platform designed for students. Features revolutionary Jarvis Mode voice assistant, AI-powered IDE, free multi-provider AI chat, and educational tools that empower the next generation of developers.',
  keywords: [
    'AI learning platform for students',
    'voice-enabled IDE',
    'Jarvis Mode AI assistant',
    'magical IDE experience',
    'democratizing tech learning',
    'student empowerment through AI',
    'AI-powered education',
    'interactive learning with AI',
    'AI tutor for programming',
    'voice-controlled coding',
    'conversational programming assistant',
    'AI learning companion',
    'educational AI tools',
    'student-first AI platform',
    'AI for computer science students',
    'learn programming with AI',
    'AI coding mentor',
    'voice programming assistant',
    'AI-enhanced learning experience',
    'personalized AI education',
    'AI assistant',
    'artificial intelligence',
    'AI chat',
    'code generation',
    'programming assistant',
    'math solver',
    'document analysis',
    'PDF analyzer',
    'web search AI',
    'Groq AI',
    'Google Gemini',
    'Llama 3.1',
    'free AI',
    'AI tools',
    'machine learning',
    'natural language processing',
    'conversational AI',
    'AI-powered search',
    'intelligent assistant',
    'multi-modal AI',
    'AI problem solving',
    'automated coding',
    'AI research',
    'smart AI',
    'advanced AI',
    'AI technology',
    'Next.js AI',
    'TypeScript AI',
    'React AI app',
    'progressive web app',
    'PWA AI',
    'mobile AI',
    'AI chatbot',
    'intelligent chatbot',
    'AI productivity',
    'AI workflow',
    'AI automation',
    'voice search optimization',
    'voice-activated AI',
    'speech-to-text AI',
    'hands-free coding',
    'accessibility AI tools',
    'voice commands for programming',
    'audio-first AI interface',
    'conversational queries',
    'natural language coding',
    'voice-driven development'
  ],
  ogImage: '/images/og-image.png',
  ogType: 'website',
  twitterCard: 'summary_large_image',
  author: 'CODEEX AI Team',
  locale: 'en_US',
  alternateLocales: ['en_GB', 'es_ES', 'fr_FR', 'de_DE', 'ja_JP', 'ko_KR', 'zh_CN']
};

export const pageSEO = {
  home: {
    title: 'CODEEX AI - Magical AI Learning Platform | Jarvis Mode Voice IDE for Students',
    description: 'Democratize tech learning with CODEEX AI - the magical AI learning platform designed for students. Features revolutionary Jarvis Mode voice assistant, AI-powered IDE, free multi-provider AI chat, and educational tools that empower the next generation of developers.',
    keywords: [
      'AI learning platform for students',
      'magical AI learning experience',
      'student-first AI platform',
      'democratizing tech learning',
      'AI for computer science students',
      'learn programming with AI',
      'AI coding mentor for students',
      'educational AI assistant',
      'interactive AI learning',
      'AI tutor for programming',
      'student empowerment through AI',
      'AI-powered education platform',
      'personalized learning with AI',
      'AI learning companion',
      'tech education democratization',
      'Jarvis Mode AI assistant',
      'voice-enabled IDE',
      'voice-controlled coding',
      'conversational programming assistant',
      'voice programming assistant',
      'hands-free coding experience',
      'voice-activated AI development',
      'speech-to-code AI',
      'natural language programming',
      'voice-driven development',
      'audio-first programming',
      'conversational coding interface',
      'voice commands for programming',
      'magical IDE experience',
      'voice-controlled development environment',
      'free AI assistant',
      'AI chat online',
      'code generator AI',
      'math problem solver',
      'document AI analyzer',
      'web search AI',
      'Groq Llama',
      'Google Gemini AI',
      'multi-provider AI',
      'intelligent assistant',
      'AI productivity tool',
      'conversational AI',
      'AI problem solving',
      'automated assistance'
    ]
  },
  chat: {
    title: 'AI Chat - Intelligent Conversations | CODEEX AI',
    description: 'Engage in intelligent conversations with advanced AI models. Get instant answers, solve problems, generate code, and explore ideas with our multi-provider AI chat system.',
    keywords: [
      'AI chat',
      'intelligent conversation',
      'AI dialogue',
      'conversational AI',
      'chat with AI',
      'AI assistant chat',
      'smart chatbot',
      'AI conversation',
      'interactive AI',
      'AI communication'
    ]
  },
  features: {
    title: 'AI Features - Code Generation, Math Solving & Document Analysis | CODEEX AI',
    description: 'Discover powerful AI features: code generation, mathematical problem solving, document analysis, image processing, web search, and more. All free with multiple AI providers.',
    keywords: [
      'AI features',
      'code generation',
      'math solver AI',
      'document analysis AI',
      'image processing AI',
      'web search AI',
      'AI capabilities',
      'AI tools features',
      'multi-modal AI',
      'AI functionality'
    ]
  },
  documentation: {
    title: 'Documentation - Complete Guide to CODEEX AI Features & API',
    description: 'Comprehensive documentation for CODEEX AI. Learn how to use all features, integrate APIs, deploy the app, and maximize your AI productivity.',
    keywords: [
      'AI documentation',
      'API documentation',
      'AI guide',
      'tutorial',
      'AI integration',
      'developer guide',
      'AI API reference',
      'implementation guide',
      'AI setup',
      'technical documentation'
    ]
  },
  contact: {
    title: 'Contact Us - Get Support for CODEEX AI',
    description: 'Need help with CODEEX AI? Contact our support team for assistance with features, technical issues, or general inquiries. We are here to help!',
    keywords: [
      'contact support',
      'AI support',
      'technical support',
      'customer service',
      'help desk',
      'AI assistance',
      'support team',
      'contact us',
      'get help',
      'customer support'
    ]
  },
  privacy: {
    title: 'Privacy Policy - Data Protection & Security | CODEEX AI',
    description: 'Learn how CODEEX AI protects your privacy and data. Our comprehensive privacy policy covers data collection, usage, security measures, and your rights.',
    keywords: [
      'privacy policy',
      'data protection',
      'privacy rights',
      'data security',
      'GDPR compliance',
      'data privacy',
      'user privacy',
      'security policy',
      'data handling',
      'privacy protection'
    ]
  }
};

export const structuredData = {
  organization: {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'EducationalOrganization'],
    name: 'CODEEX AI',
    description: 'Magical AI Learning Platform democratizing tech education for students worldwide through voice-enabled IDE and Jarvis Mode assistant',
    url: 'https://codeex-ai.netlify.app',
    logo: 'https://codeex-ai.netlify.app/images/logo.png',
    foundingDate: '2024',
    mission: 'Democratizing technology learning through magical AI experiences that empower students',
    educationalCredentialAwarded: 'AI-Enhanced Programming Skills',
    audience: {
      '@type': 'EducationalAudience',
      educationalRole: 'student',
      audienceType: 'Computer Science Students, Programming Learners, Tech Enthusiasts'
    },
    sameAs: [
      'https://github.com/heoster/codeex-ai',
      'https://twitter.com/codeexai',
      'https://linkedin.com/company/codeex-ai'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: 'codeex@email.com',
      availableLanguage: ['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese']
    },
    knowsAbout: [
      'Artificial Intelligence Education',
      'Voice-Controlled Programming',
      'AI-Powered Learning',
      'Student Empowerment',
      'Conversational AI',
      'Educational Technology'
    ]
  },
  
  softwareApplication: {
    '@context': 'https://schema.org',
    '@type': ['SoftwareApplication', 'LearningResource'],
    name: 'CODEEX AI - Magical AI Learning Platform',
    description: 'Revolutionary AI learning platform with Jarvis Mode voice assistant, democratizing tech education for students through magical AI experiences',
    applicationCategory: ['EducationalApplication', 'ProductivityApplication', 'DeveloperApplication'],
    operatingSystem: 'Web Browser, iOS, Android, Windows, macOS, Linux',
    accessibilityFeature: [
      'voiceControl',
      'speechRecognition',
      'keyboardNavigation',
      'screenReaderSupport',
      'highContrastDisplay'
    ],
    educationalLevel: ['Beginner', 'Intermediate', 'Advanced'],
    learningResourceType: ['Interactive Tutorial', 'AI Assistant', 'Code Generator', 'Problem Solver'],
    educationalUse: 'Learning Programming, AI Education, Code Development, Problem Solving',
    audience: {
      '@type': 'EducationalAudience',
      educationalRole: 'student'
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      description: 'Completely free AI learning platform for students'
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      ratingCount: '2500',
      bestRating: '5',
      worstRating: '1'
    },
    author: {
      '@type': 'Organization',
      name: 'CODEEX AI Team'
    },
    datePublished: '2024-01-01',
    dateModified: '2024-12-13',
    version: '2.0.0',
    downloadUrl: 'https://codeex-ai.netlify.app',
    screenshot: 'https://codeex-ai.netlify.app/images/screenshot.png',
    featureList: [
      'Jarvis Mode Voice Assistant',
      'Voice-Enabled IDE',
      'AI Learning Companion',
      'Multi-provider AI chat',
      'Code generation and debugging',
      'Mathematical problem solving',
      'Document analysis and Q&A',
      'Image processing and OCR',
      'Web search integration',
      'Progressive Web App',
      'Offline functionality',
      'Voice synthesis and recognition',
      'Conversational programming',
      'Educational AI tools',
      'Student-first design',
      'Accessibility features'
    ],
    keywords: 'AI learning platform, voice-enabled IDE, Jarvis Mode, student empowerment, democratizing tech learning, conversational AI, educational technology'
  },

  website: {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'CODEEX AI',
    description: 'Magical AI Learning Platform for Students',
    url: 'https://codeex-ai.netlify.app',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://codeex-ai.netlify.app/search?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    },
    author: {
      '@type': 'Organization',
      name: 'CODEEX AI Team'
    },
    publisher: {
      '@type': 'Organization',
      name: 'CODEEX AI',
      logo: {
        '@type': 'ImageObject',
        url: 'https://codeex-ai.netlify.app/images/logo.png'
      }
    }
  },

  faq: {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Is CODEEX AI free to use?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, CODEEX AI is completely free to use. We provide access to multiple AI providers including Groq and Google Gemini models without any cost to users. No subscription fees, no API keys required, and no hidden charges.'
        }
      },
      {
        '@type': 'Question',
        name: 'What AI models does CODEEX AI support?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'CODEEX AI supports multiple cutting-edge AI models including Llama 3.1 70B, Llama 3.1 8B, Mixtral 8x7B, Google Gemini 2.5 Flash, and more. We automatically route to the best available model based on your query type and requirements.'
        }
      },
      {
        '@type': 'Question',
        name: 'Can I use CODEEX AI offline?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, CODEEX AI is a Progressive Web App (PWA) that works offline. You can install it on your device and access cached conversations and features without an internet connection. Your chat history and settings are stored locally.'
        }
      },
      {
        '@type': 'Question',
        name: 'What types of problems can CODEEX AI solve?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'CODEEX AI can help with code generation and debugging, mathematical problem solving, document analysis and Q&A, image processing and OCR, web search and research, essay writing, language translation, data analysis, and general question answering across various domains.'
        }
      },
      {
        '@type': 'Question',
        name: 'How can students use AI for learning programming?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Students can use CODEEX AI for learning programming through interactive AI tutoring, voice-controlled coding with Jarvis Mode, real-time code generation and debugging, step-by-step problem explanations, personalized learning paths, and conversational programming assistance. The platform democratizes tech learning by making AI accessible to all students.'
        }
      },
      {
        '@type': 'Question',
        name: 'What is Jarvis Mode and how does it help students?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Jarvis Mode is CODEEX AI revolutionary voice-enabled IDE that allows students to code using natural speech. Students can dictate code, ask questions verbally, get voice explanations, and control the development environment hands-free. This magical experience makes programming more accessible and intuitive for visual and auditory learners.'
        }
      },
      {
        '@type': 'Question',
        name: 'How does CODEEX AI democratize tech learning?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'CODEEX AI democratizes tech learning by providing free access to advanced AI tutoring, removing barriers through voice interfaces, offering personalized learning experiences, supporting multiple learning styles, providing 24/7 AI mentorship, and making complex programming concepts accessible to students regardless of background or resources.'
        }
      },
      {
        '@type': 'Question',
        name: 'What makes CODEEX AI magical for students?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'CODEEX AI creates a magical learning experience through Jarvis Mode voice interactions, intuitive conversational programming, instant AI feedback, personalized learning adaptation, seamless voice-to-code translation, and an interface that feels like having a personal AI mentor available 24/7.'
        }
      },
      {
        '@type': 'Question',
        name: 'How do I get started with voice-controlled programming?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'To start voice-controlled programming with CODEEX AI, simply enable Jarvis Mode in the settings, allow microphone access, and begin speaking your code naturally. Say "Create a function that..." or "Help me debug this error..." and the AI will understand and assist you through voice commands.'
        }
      },
      {
        '@type': 'Question',
        name: 'Can CODEEX AI help me learn my first programming language?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Absolutely! CODEEX AI is designed for beginners. It provides step-by-step guidance, explains concepts in simple terms, offers interactive coding exercises, and adapts to your learning pace. The voice interface makes it especially friendly for new programmers who might find traditional coding intimidating.'
        }
      },
      {
        '@type': 'Question',
        name: 'What programming languages can I learn with CODEEX AI?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'CODEEX AI supports all major programming languages including Python, JavaScript, Java, C++, C#, Go, Rust, TypeScript, HTML/CSS, SQL, and more. The AI can generate code, explain syntax, debug errors, and provide learning resources for any language you want to learn.'
        }
      },
      {
        '@type': 'Question',
        name: 'Is CODEEX AI suitable for computer science students?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, CODEEX AI is specifically designed with computer science students in mind. It helps with homework, explains algorithms, assists with coding assignments, provides debugging support, and offers 24/7 tutoring. The platform democratizes access to high-quality programming education.'
        }
      },
      {
        '@type': 'Question',
        name: 'How does voice search work with CODEEX AI?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'CODEEX AI is optimized for voice search and natural language queries. You can ask questions like "How do I sort an array in Python?" or "What is the best way to learn React?" and get instant, conversational responses. The AI understands context and provides relevant, educational answers.'
        }
      },
      {
        '@type': 'Question',
        name: 'Can I use CODEEX AI for coding interviews preparation?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! CODEEX AI is excellent for coding interview preparation. It can generate practice problems, explain algorithmic solutions, help you understand time complexity, provide coding challenges, and even conduct mock interviews through conversational AI interaction.'
        }
      },
      {
        '@type': 'Question',
        name: 'What accessibility features does CODEEX AI offer?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'CODEEX AI prioritizes accessibility with voice control for hands-free operation, screen reader compatibility, keyboard navigation support, high contrast modes, and speech synthesis for audio feedback. These features make programming accessible to students with various disabilities and learning preferences.'
        }
      },
      {
        '@type': 'Question',
        name: 'How does CODEEX AI compare to other AI coding assistants?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'CODEEX AI stands out with its focus on education, voice-enabled Jarvis Mode, student-first design, completely free access, multi-provider AI support, and emphasis on democratizing tech learning. Unlike other tools focused on professional developers, CODEEX AI is specifically designed to empower students and beginners.'
        }
      }
    ]
  }
};

export const generateSitemap = () => {
  const baseUrl = 'https://codeex-ai.netlify.app';
  const currentDate = '2024-12-13';
  
  const pages = [
    // Core pages - highest priority
    { url: '', priority: '1.0', changefreq: 'daily', lastmod: currentDate },
    { url: '/chat', priority: '0.9', changefreq: 'daily', lastmod: currentDate },
    
    // Feature pages - high priority
    { url: '/features', priority: '0.8', changefreq: 'weekly', lastmod: currentDate },
    { url: '/jarvis-mode', priority: '0.8', changefreq: 'weekly', lastmod: currentDate },
    { url: '/voice-programming', priority: '0.8', changefreq: 'weekly', lastmod: currentDate },
    
    // Educational content - high priority for students
    { url: '/learn', priority: '0.8', changefreq: 'weekly', lastmod: currentDate },
    { url: '/tutorials', priority: '0.8', changefreq: 'weekly', lastmod: currentDate },
    { url: '/documentation', priority: '0.8', changefreq: 'weekly', lastmod: currentDate },
    { url: '/getting-started', priority: '0.7', changefreq: 'weekly', lastmod: currentDate },
    
    // Student-focused pages
    { url: '/for-students', priority: '0.7', changefreq: 'weekly', lastmod: currentDate },
    { url: '/computer-science', priority: '0.7', changefreq: 'weekly', lastmod: currentDate },
    { url: '/programming-help', priority: '0.7', changefreq: 'weekly', lastmod: currentDate },
    { url: '/ai-tutoring', priority: '0.7', changefreq: 'weekly', lastmod: currentDate },
    
    // Information pages
    { url: '/about', priority: '0.7', changefreq: 'monthly', lastmod: currentDate },
    { url: '/faq', priority: '0.6', changefreq: 'weekly', lastmod: currentDate },
    { url: '/contact', priority: '0.6', changefreq: 'monthly', lastmod: currentDate },
    { url: '/support', priority: '0.6', changefreq: 'monthly', lastmod: currentDate },
    
    // Technical pages
    { url: '/models', priority: '0.7', changefreq: 'weekly', lastmod: currentDate },
    { url: '/api', priority: '0.6', changefreq: 'monthly', lastmod: currentDate },
    { url: '/integrations', priority: '0.6', changefreq: 'monthly', lastmod: currentDate },
    
    // Accessibility and inclusion
    { url: '/accessibility', priority: '0.6', changefreq: 'monthly', lastmod: currentDate },
    { url: '/inclusive-design', priority: '0.6', changefreq: 'monthly', lastmod: currentDate },
    
    // Legal pages
    { url: '/privacy', priority: '0.5', changefreq: 'monthly', lastmod: currentDate },
    { url: '/terms', priority: '0.5', changefreq: 'monthly', lastmod: currentDate },
    { url: '/security', priority: '0.5', changefreq: 'monthly', lastmod: currentDate },
    
    // User pages
    { url: '/login', priority: '0.4', changefreq: 'monthly', lastmod: currentDate },
    { url: '/register', priority: '0.4', changefreq: 'monthly', lastmod: currentDate },
    { url: '/profile', priority: '0.3', changefreq: 'monthly', lastmod: currentDate }
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${pages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
    <mobile:mobile/>
    ${page.url === '' ? `<xhtml:link rel="alternate" hreflang="en" href="${baseUrl}${page.url}"/>
    <xhtml:link rel="alternate" hreflang="es" href="${baseUrl}/es${page.url}"/>
    <xhtml:link rel="alternate" hreflang="fr" href="${baseUrl}/fr${page.url}"/>` : ''}
  </url>`).join('\n')}
</urlset>`;
};

export const generateRobotsTxt = () => {
  return `User-agent: *
Allow: /
Crawl-delay: 1

# Major Search Engines
User-agent: Googlebot
Allow: /
Crawl-delay: 1

User-agent: Bingbot
Allow: /
Crawl-delay: 1

User-agent: Slurp
Allow: /
Crawl-delay: 1

User-agent: DuckDuckBot
Allow: /
Crawl-delay: 1

User-agent: Baiduspider
Allow: /
Crawl-delay: 2

User-agent: YandexBot
Allow: /
Crawl-delay: 2

# AI Search Engines
User-agent: ChatGPT-User
Allow: /

User-agent: GPTBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: YouBot
Allow: /

# Social Media Crawlers
User-agent: facebookexternalhit
Allow: /

User-agent: Twitterbot
Allow: /

User-agent: LinkedInBot
Allow: /

User-agent: WhatsApp
Allow: /

User-agent: TelegramBot
Allow: /

# Disallowed paths
Disallow: /api/
Disallow: /_next/
Disallow: /admin/
Disallow: /private/
Disallow: /test/
Disallow: /.well-known/
Disallow: /debug/

# Important files
Sitemap: https://codeex-ai.netlify.app/sitemap.xml
Sitemap: https://codeex-ai.netlify.app/sitemap-images.xml
Sitemap: https://codeex-ai.netlify.app/sitemap-videos.xml

# Host directive
Host: https://codeex-ai.netlify.app
`;
};