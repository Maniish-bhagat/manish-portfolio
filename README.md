# Manish Bhagat - Developer Portfolio

A modern, high-performance developer portfolio built for **Manish Bhagat**, Computer Science & Engineering student and aspiring Software/Full-Stack Developer.

Built with **Next.js**, **React**, **JavaScript**, **Tailwind CSS**, and **Framer Motion**.

---

## 🚀 Tech Stack

- **Framework**: Next.js (App Router)
- **Library**: React.js (JavaScript)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Email Service**: Nodemailer (Contact API route)

---

## 📁 Project Structure

```text
manish-portfolio/
│
├── app/
│   ├── layout.js            # Root layout with fonts & metadata
│   ├── page.js              # Home page aggregating all sections
│   ├── globals.css          # Tailwind base & dark theme styles
│   └── api/
│       └── contact/
│           └── route.js      # Contact form POST API route
│
├── components/
│   ├── layout/
│   │   ├── Navbar.jsx       # Responsive glassmorphic navbar
│   │   └── Footer.jsx       # Large developer footer
│   │
│   ├── sections/
│   │   ├── Hero.jsx         # Hero banner & terminal widget
│   │   ├── About.jsx        # Authentic background & focus areas
│   │   ├── Skills.jsx       # Categorized skill matrix
│   │   ├── Projects.jsx     # Project showcase & Krishi Mitra modal
│   │   ├── Journey.jsx      # Developer timeline
│   │   ├── Certifications.jsx # Verified certifications
│   │   └── Contact.jsx      # Contact form & social cards
│   │
│   ├── ui/                  # Reusable UI components
│   │   ├── Button.jsx
│   │   ├── SectionHeading.jsx
│   │   ├── ProjectCard.jsx
│   │   └── SocialLinks.jsx
│   │
│   └── animations/          # Framer Motion animation wrappers
│       ├── FadeIn.jsx
│       ├── SlideUp.jsx
│       └── StaggerContainer.jsx
│
├── data/                    # Data sources (no hardcoding in UI)
│   ├── projects.js
│   ├── skills.js
│   ├── certifications.js
│   └── socialLinks.js
│
├── lib/
│   └── email.js             # Nodemailer handler
│
├── public/
│   ├── images/              # Project & profile images
│   └── resume/              # Resume PDF
│
├── .env.local               # Environment variables
├── next.config.mjs
├── tailwind.config.js
└── package.json
```

---

## 💻 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production
```bash
npm run build
```

---

## 📄 License

© 2026 Manish Bhagat. All rights reserved.
