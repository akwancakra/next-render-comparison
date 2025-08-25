# Next.js Rendering Methods Comparison Dashboard

A comprehensive, real-time performance analytics dashboard that compares different Next.js rendering methods including SSR, SSG, ISR, CSR, and Streaming SSR. This educational tool helps developers understand the performance characteristics and use cases of each rendering approach.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38bdf8)
![ShadcnUI](https://img.shields.io/badge/ShadcnUI-Latest-000000)

## 🚀 Features

### 📊 Performance Analytics

- **Real-time Metrics**: Live monitoring of Core Web Vitals (TTFB, FCP, LCP, INP, CLS)
- **Interactive Charts**: Responsive visualizations using shadcn/ui chart components
- **Comparison Analysis**: Side-by-side performance comparison across rendering methods
- **Performance Scoring**: Automated performance grading based on Web Vitals thresholds

### 🎨 Modern UI/UX

- **Responsive Design**: Mobile-first approach supporting desktop, tablet, and mobile devices
- **Dark/Light Mode**: Automatic theme switching with system preference detection
- **Accessible Interface**: WCAG compliant with proper ARIA labels and keyboard navigation
- **Floating Help**: Built-in technical glossary for educational purposes

### 🔧 Rendering Methods Covered

- **SSR (Server-Side Rendering)**: Pages rendered on each request
- **SSG (Static Site Generation)**: Pre-built pages at build time
- **ISR (Incremental Static Regeneration)**: Static pages with background updates
- **CSR (Client-Side Rendering)**: Browser-rendered JavaScript applications
- **Streaming SSR**: Progressive server rendering for improved performance

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/) for type safety
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) for responsive design
- **UI Components**: [ShadcnUI](https://ui.shadcn.com/) for consistent design system
- **Charts**: [Recharts](https://recharts.org/) with shadcn/ui integration
- **Icons**: [Lucide React](https://lucide.dev/) for modern iconography

## 🚀 Getting Started

### Prerequisites

Make sure you have Node.js 18+ installed on your system.

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd multi-render-check
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

### Development

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the dashboard.

### Building for Production

Create an optimized production build:

```bash
npm run build
# or
yarn build
# or
pnpm build
```

## 📱 Usage

### Dashboard Navigation

1. **Overview Tab**: Real-time performance comparison across all rendering methods
2. **Individual Method Tabs**: Detailed analysis for SSR, SSG, ISR, CSR, and Streaming SSR
3. **Performance Charts**: Interactive visualizations with responsive design
4. **Help Button**: Click the floating help button (❓) for technical term explanations

### Performance Metrics

The dashboard monitors and displays:

- **TTFB**: Time to First Byte - Server response time
- **FCP**: First Contentful Paint - Initial content rendering
- **LCP**: Largest Contentful Paint - Main content loading
- **INP**: Interaction to Next Paint - Responsiveness measure
- **CLS**: Cumulative Layout Shift - Visual stability
- **Bundle Size**: JavaScript and CSS file sizes
- **Request Count**: Number of network requests

### Theme Switching

Toggle between light and dark modes using the theme switcher in the top-right corner. The application automatically detects and respects your system preference.

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js 14 App Router
│   ├── layout.tsx         # Root layout with metadata
│   ├── page.tsx           # Main dashboard page
│   └── globals.css        # Global styles and CSS variables
├── components/
│   ├── ui/                # ShadcnUI components
│   ├── ComparisonCharts.tsx    # Chart visualizations
│   ├── MetricsCard.tsx         # Performance metric displays
│   ├── RenderingComparisonDashboard.tsx  # Main dashboard
│   ├── ThemeProvider.tsx       # Theme context provider
│   └── ThemeToggle.tsx         # Theme switcher component
├── hooks/
│   └── usePerformance.ts      # Performance monitoring hooks
├── lib/
│   ├── performance.ts         # Performance calculation utilities
│   └── utils.ts              # General utility functions
└── types/                     # TypeScript type definitions
```

## 🎯 Educational Value

This dashboard serves as an educational tool for:

- **Web Developers**: Understanding performance implications of different rendering strategies
- **Students**: Learning modern web development concepts and performance optimization
- **Teams**: Making informed decisions about rendering methods for specific use cases
- **DevOps Engineers**: Understanding performance monitoring and optimization strategies

## 🔧 Configuration

### Environment Variables

No environment variables required for basic functionality. The dashboard uses simulated data for educational purposes.

### Customization

- **Themes**: Modify color schemes in `src/app/globals.css`
- **Metrics**: Adjust performance thresholds in `src/lib/performance.ts`
- **Charts**: Customize visualizations in `src/components/ComparisonCharts.tsx`
- **Content**: Update explanations in the help dialog within `RenderingComparisonDashboard.tsx`

## 📊 Performance Monitoring

The application includes:

- **Simulated Metrics**: Realistic performance data based on typical rendering method characteristics
- **Real-time Updates**: Dynamic data refresh every 3 seconds
- **Responsive Charts**: Mobile-optimized visualizations
- **Performance Grading**: Automated scoring based on Web Vitals standards

## 🌐 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Guidelines

1. Follow the existing code style and TypeScript conventions
2. Ensure responsive design works on all device sizes
3. Maintain accessibility standards (WCAG 2.1)
4. Test dark/light mode compatibility
5. Update documentation for new features

## 📚 Learning Resources

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and rendering methods
- [TypeScript Handbook](https://www.typescriptlang.org/docs/) - Master TypeScript
- [Tailwind CSS Docs](https://tailwindcss.com/docs) - Utility-first CSS framework
- [ShadcnUI Components](https://ui.shadcn.com/) - Reusable component library
- [Web Vitals Guide](https://web.dev/vitals/) - Google&apos;s performance metrics
- [Recharts Documentation](https://recharts.org/en-US/) - Chart library for React

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🚀 Deployment

### Vercel (Recommended)

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Import your project to Vercel
3. Vercel will detect Next.js and configure optimal settings automatically
4. Your app will be deployed and available at a `.vercel.app` URL

### Other Platforms

- **Netlify**: Build command: `npm run build`, Publish directory: `out` (with `output: 'export'` in next.config.js)
- **Railway**: Automatic deployment with `railway up`
- **Docker**: Use the included Dockerfile for containerized deployment

### Docker Deployment

#### Quick Start with Docker

1. **Build the Docker image**:

```bash
docker build -t multi-render-dashboard .
```

2. **Run the container**:

```bash
docker run -p 3000:3000 multi-render-dashboard
```

3. **Access the application**: Open [http://localhost:3000](http://localhost:3000)

#### Using Docker Compose (Recommended)

1. **Start the production service**:

```bash
docker-compose up -d
```

2. **Start with development mode**:

```bash
docker-compose --profile dev up -d dev
```

3. **View logs**:

```bash
docker-compose logs -f app
```

4. **Stop services**:

```bash
docker-compose down
```

#### Docker Features

- **Multi-stage build**: Optimized for production with minimal image size
- **Security**: Runs as non-root user with proper permissions
- **Health checks**: Built-in container health monitoring
- **Hot reload**: Development mode with volume mounting
- **Production ready**: Standalone Next.js output for optimal performance

For detailed deployment instructions, check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).

---

**Built with ❤️ using Next.js 14, TypeScript, and modern web technologies.**
