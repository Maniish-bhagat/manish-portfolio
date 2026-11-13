export const projectsData = [
  {
    id: 'ecokart',
    title: 'EcoKart',
    featured: true,
    // badge: 'Sustainable E-Commerce',
    category: 'fullstack',
    image: '/images/projects/ecokart.jpg',
    description: 'EcoKart is an eco-friendly e-commerce marketplace designed to make sustainable shopping more transparent. It helps customers identify genuinely sustainable products through an explainable Eco Score system, greenwashing claim detection, seller certificate verification, and a multilingual shopping assistant.',
    technologies: [
      'Python 3',
      'Flask',
      'SQLite',
      'HTML5',
      'CSS3',
      'Jinja2',
      'Anthropic API (Optional AI integration)'
    ],
    githubUrl: 'https://github.com/manishbhagat-dev/ecokart',
    liveUrl: '#',
    caseStudy: {
      problem: 'Consumers struggle to identify genuinely sustainable goods amidst confusing marketing, unverified environmental assertions, and widespread greenwashing, while lacking transparent metrics on product lifecycle impacts.',
      solution: 'EcoKart provides a transparent marketplace prototype featuring a rule-based Eco Score system (grades A to E), automated greenwashing risk scoring (0 to 100), human/admin seller certificate verification, and a retrieval-first multilingual shopping assistant.',
      features: [
        'Eco Score System: Evaluates products based on materials, packaging, verified certifications, transportation distance, durability, and end-of-life factors. Assigns grades from A to E (rule-based prototype, not a formally validated lifecycle assessment).',
        'Greenwashing Detection: Analyzes environmental product claims, generates a risk score from 0 to 100, and identifies the evidence required to support those claims.',
        'Multilingual Shopping Assistant: Supports Hindi, English, and Hinglish queries and recommends relevant products from the available catalogue using a retrieval-first approach.',
        'Seller Verification: Allows sellers to submit products and certification documents for human/admin review and approval.',
        'CO₂ Estimation: Provides approximate carbon-emission estimates to help customers understand the environmental impact of products.'
      ],
      technologyDetails: 'Built using Python 3 and Flask for the backend, SQLite for relational database storage, Jinja2 template engine, HTML5 and CSS3 for frontend presentation, and optional Anthropic API integration for the conversational shopping assistant. Verified with 20 passing automated tests.',
      myRole: 'Full-Stack Developer - Implemented rule-based sustainability scoring logic, greenwashing risk analyzer, seller certification submission flow, multilingual catalogue retrieval, and 20 automated test suites.',
      challenges: 'Formulating consistent, explainable rule-based scoring criteria and building reliable Hindi/English/Hinglish query understanding while ensuring approximate CO₂ estimations remain transparent.',
      result: 'Delivered an explainable sustainable e-commerce platform prototype with 20 automated tests passing in the project test report.'
    }
  },
  {
    id: 'krishi-mitra',
    title: 'Krishi Mitra - Smart Agriculture Platform',
    featured: true,
    // badge: 'Featured Case Study',
    category: 'fullstack',
    image: '/images/projects/krishi-mitra.jpg',
    description: 'An AI-assisted agricultural advisory and marketplace web application designed to help farmers optimize crop yield, monitor weather telemetry, and access direct market pricing.',
    technologies: ['React', 'Next.js', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS', 'REST API'],
    githubUrl: 'https://github.com/manishbhagat-dev/krishi-mitra',
    liveUrl: '#',
    caseStudy: {
      problem: 'Farmers often lack real-time access to localized soil insights, accurate weather telemetry, crop disease diagnostics, and direct market commodity rates, leading to crop loss and reduced profitability.',
      solution: 'Krishi Mitra bridges the information gap by providing a central dashboard for real-time crop disease detection, localized micro-weather updates, soil health analysis, and direct farmer-to-buyer crop listings.',
      features: [
        'AI/ML powered crop health and disease diagnostic advisor.',
        'Real-time mandi (market) price tracking across regions.',
        'Localized weather forecast integration with agricultural alerts.',
        'Farmer community forum for peer knowledge sharing.',
        'Responsive multi-language support layout.'
      ],
      technologyDetails: 'Built using React and Next.js for high-performance client rendering, Node.js and Express for REST API middleware, MongoDB for flexible unstructured data storage, and Tailwind CSS for responsive dark-mode styling.',
      myRole: 'Lead Full-Stack Developer - Architected backend REST APIs, implemented responsive frontend views, integrated MongoDB schemas, and optimized database query response times.',
      challenges: 'Handling real-time API integrations for dynamic market pricing while keeping page loads under 1.5 seconds on low-bandwidth rural mobile networks.',
      result: 'Successfully deployed a functional prototype capable of handling multi-region crop advisories, earning positive evaluation in hackathon presentations.'
    }
  },
  {
    id: 'zerodha-style',
    title: 'Zerodha  style Financial Trading Platform ',
    featured: false,
    // badge: 'Full-Stack Web',
    category: 'fullstack',
    image: '/images/projects/zerodha-clone.jpg',
    description: 'A comprehensive web-based stock trading dashboard clone featuring live stock price charts, order execution interface, portfolio holdings tracker, and user analytics.',
    technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Chart.js', 'Tailwind CSS'],
    githubUrl: 'https://github.com/manishbhagat-dev/zerodha-clone',
    liveUrl: '#',
    caseStudy: {
      problem: 'Simulating high-frequency financial dashboards requires efficient client state management and dynamic UI updates without lag.',
      solution: 'Engineered a modular React application mirroring Zerodha\'s Kite trading UI, complete with watchlist management, order books, and dynamic chart visualizations.',
      features: [
        'Interactive candlestick and line stock price chart visualizations.',
        'Buy/Sell order modal with target price calculations.',
        'Real-time portfolio P&L summary dashboard.',
        'Responsive navigation and watchlists.'
      ],
      technologyDetails: 'React components integrated with Chart.js for data visualization, Express.js backend for authentication and transaction endpoints, and MongoDB for user portfolio persistence.',
      myRole: 'Full-Stack Developer - Built frontend interface components, chart widgets, and backend CRUD API services.',
      challenges: 'Optimizing continuous state re-renders when updating live price feeds in multi-item watchlists.',
      result: 'Delivered a sleek, performant trading dashboard interface replicating real-world fintech UX standards.'
    }
  },
  {
    id: 'spotify-clone',
    title: 'Spotify Clone - Web Music Player',
    featured: false,
    // badge: 'Full-Stack Audio',
    category: 'fullstack',
    image: '/images/projects/spotify-clone.jpg',
    description: 'A full-stack Spotify-inspired web music streaming application featuring dynamic audio playback, playlist management, user library curation, and persistent song storage.',
    technologies: ['JavaScript', 'HTML5', 'CSS3', 'Node.js', 'Express', 'MongoDB'],
    githubUrl: 'https://github.com/manishbhagat-dev/spotify-clone',
    liveUrl: '#',
    caseStudy: {
      problem: 'Building a responsive, high-performance web audio player requires seamless playback state management, low-latency audio buffering, and structured metadata storage for artists, albums, and user playlists.',
      solution: 'Architected a progressive full-stack audio player starting with a responsive HTML5/CSS3/JavaScript frontend with custom audio controls, backed by a Node.js and Express RESTful API with MongoDB for storing songs, artist catalogs, user libraries, and playlists.',
      features: [
        'Interactive Audio Player: Custom playback controls including play, pause, seek bar, volume control, track skipping, and repeat/shuffle modes.',
        'Dynamic Music Library: Browse curated albums, trending playlists, and individual song tracks with cover art metadata.',
        'Backend API Architecture: Node.js and Express service handling audio streaming endpoints, user authentication, and song catalogue management.',
        'MongoDB Database: Schemas for storing songs, artist details, user profiles, liked tracks, and personalized playlists.',
        'Production Deployment: Cloud deployment configured with Netlify / Vercel with optimized static asset caching and responsive dark UI.'
      ],
      technologyDetails: 'Built with vanilla JavaScript, modern semantic HTML5, and responsive CSS3 for the client UI, paired with a Node.js and Express.js REST API layer, MongoDB database for persistent song and user collection records, and deployed via Vercel/Netlify.',
      myRole: 'Full-Stack Developer - Designed the audio player controller state machine, built responsive Spotify-themed UI components, implemented backend REST API routes, and structured MongoDB schemas.',
      challenges: 'Managing smooth HTML5 Audio API event listeners (timeupdate, loadedmetadata, ended) without UI stuttering, and coordinating asynchronous song streaming with real-time seek scrubbing.',
      result: 'Successfully created a sleek, full-featured Spotify web player clone delivering fluid music playback, custom playlist management, and a clean full-stack architectural roadmap.'
    }
  }
];
