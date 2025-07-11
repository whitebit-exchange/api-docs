import LogViewer from "@/components/log-viewer";
import {
  ArrowRight,
  Zap,
  Shield,
  Globe,
  BarChart3,
  Code,
  Layers,
  Sparkles,
  Headphones,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen relative bg-gradient-to-b from-background to-background/50">
      {/* Hero Section */}
      <div className="py-12 px-4 border-b relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(white,transparent_70%)]" />
        <div className="max-w-6xl mx-auto relative">
          <div className="flex flex-col gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col gap-6"
            >
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/50">
                WhiteBIT API Platform
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                Access the global cryptocurrency market with WhiteBIT&apos;s
                comprehensive trading APIs. Build powerful trading applications
                with our developer-friendly tools.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 rounded-full bg-secondary/50 px-3 py-1.5">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Low Latency</span>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-secondary/50 px-3 py-1.5">
                  <Globe className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Global Access</span>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-secondary/50 px-3 py-1.5">
                  <Headphones className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">24/7 Support</span>
                </div>
              </div>
              <div className="flex gap-4 items-center">
                <Link href="/overview">
                  <Button size="lg" className="group">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="relative"
            >
              <section className="space-y-8">
                <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-semibold">
                        API Activity
                      </h3>
                      <div className="flex items-center gap-2 rounded-full bg-secondary/50 px-2 py-1">
                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-xs font-medium">Live Demo</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Watch our high-performance API handle thousands of trading
                      operations in real-time. From market orders to advanced
                      trading strategies, see the full spectrum of what&apos;s
                      possible.
                    </p>
                  </div>
                </header>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
                  <LogViewer className="shadow-lg rounded-lg border bg-card/50 backdrop-blur-sm overflow-hidden" />
                </div>
              </section>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Everything You Need</h2>
            <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
              Build powerful trading applications with our comprehensive suite
              of APIs and tools
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: Zap,
                title: "Advanced Trading",
                description:
                  "Full access to spot trading, margin trading, and futures markets with high-performance execution.",
              },
              {
                icon: BarChart3,
                title: "Real-time Data",
                description:
                  "Live market data, order book updates, and trade execution via WebSocket with millisecond latency.",
              },
              {
                icon: Shield,
                title: "Enterprise Grade",
                description:
                  "High-performance infrastructure with exceptional uptime and industry-leading security measures.",
              },
              {
                icon: Globe,
                title: "Global Compliance",
                description:
                  "Built-in compliance tools and security features for safe trading across jurisdictions.",
              },
              {
                icon: Code,
                title: "Developer Tools",
                description:
                  "Comprehensive SDKs, detailed documentation, and code examples to accelerate your development process.",
              },
              {
                icon: Layers,
                title: "Market Coverage",
                description:
                  "Access to a wide range of spot and derivative markets with support for multiple trading pairs and instruments.",
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                viewport={{ once: true, margin: "50px" }}
                className="group p-8 rounded-lg border bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-colors hover:shadow-lg hover:-translate-y-1"
              >
                <div className="mb-4 p-2.5 w-fit rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="text-primary h-5 w-5" />
                </div>
                <h3 className="text-lg md:text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-sm md:text-base text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 border-t">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-muted-foreground text-base md:text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of developers building with WhiteBIT&apos;s API platform
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="https://whitebit.com/settings/api/api-keys"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="lg" className="group">
                  Create API Key
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/overview">
                <Button size="lg" variant="outline">
                  Read the Docs
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
