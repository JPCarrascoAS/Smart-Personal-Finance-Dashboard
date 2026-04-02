"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Wallet,
  BarChart3,
  Lightbulb,
  Shield,
  ArrowRight,
  TrendingUp,
  PieChart,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: BarChart3,
    title: "Smart Dashboard",
    description:
      "Get a real-time overview of your finances with interactive charts showing income, expenses, and savings trends.",
  },
  {
    icon: Lightbulb,
    title: "AI-Powered Insights",
    description:
      "Receive personalized financial recommendations powered by GPT-4o that analyze your spending patterns.",
  },
  {
    icon: PieChart,
    title: "Category Tracking",
    description:
      "Automatically categorize your transactions and visualize where your money goes each month.",
  },
  {
    icon: TrendingUp,
    title: "Trend Analysis",
    description:
      "Track your financial progress over time with detailed monthly trends and savings rate calculations.",
  },
  {
    icon: Shield,
    title: "Anomaly Detection",
    description:
      "Get alerted about unusual spending patterns so you can stay on top of your budget.",
  },
  {
    icon: Zap,
    title: "Fast & Responsive",
    description:
      "Built with modern tech for a smooth experience on desktop and mobile devices alike.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

export function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-accent/8 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/8 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-0 w-[300px] h-[300px] bg-income/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-accent to-purple-500 flex items-center justify-center">
              <Wallet className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">FinanceAI</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Sign in
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Get started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pt-16 pb-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-sm text-muted mb-8">
            <Zap className="h-4 w-4 text-accent" />
            Powered by AI
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight max-w-3xl mx-auto">
            Your finances,{" "}
            <span className="gradient-text">intelligently managed</span>
          </h1>

          <p className="text-lg text-muted max-w-xl mx-auto mt-6">
            Track expenses, analyze spending patterns, and get personalized
            AI-powered insights to optimize your financial health.
          </p>

          <div className="flex items-center justify-center gap-4 mt-10">
            <Link href="/register">
              <Button size="lg" className="text-base px-8">
                Start for free
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="text-base px-8">
                Sign in
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Dashboard preview mockup */}
        <motion.div
          className="mt-20 glass rounded-2xl p-4 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="rounded-xl bg-background/80 p-6 space-y-4">
            <div className="grid grid-cols-3 gap-4">
              {["$12,450", "$4,200", "$8,250"].map((val, i) => (
                <div key={i} className="glass rounded-xl p-4 text-center">
                  <div className="text-xs text-muted mb-1">
                    {["Balance", "Income", "Expenses"][i]}
                  </div>
                  <div className="text-lg font-bold text-foreground">{val}</div>
                </div>
              ))}
            </div>
            <div className="glass rounded-xl p-4 h-32 flex items-end gap-1">
              {[40, 65, 55, 80, 70, 90, 60, 75, 85, 50, 70, 95].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t bg-gradient-to-t from-accent/40 to-accent/80"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground">
            Everything you need to manage your money
          </h2>
          <p className="text-muted mt-3 max-w-lg mx-auto">
            From tracking daily expenses to getting AI-powered financial advice,
            we&apos;ve got you covered.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              className="glass glass-hover rounded-2xl p-6 transition-all duration-300"
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                <feature.icon className="h-5 w-5 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-24">
        <div className="glass rounded-3xl p-12 text-center gradient-border">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Ready to take control of your finances?
          </h2>
          <p className="text-muted max-w-md mx-auto mb-8">
            Join thousands of users who are making smarter financial decisions
            with AI-powered insights.
          </p>
          <Link href="/register">
            <Button size="lg" className="text-base px-10">
              Get started free
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border">
        <div className="max-w-6xl mx-auto px-6 py-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-accent" />
            <span className="text-sm font-semibold gradient-text">
              FinanceAI
            </span>
          </div>
          <p className="text-xs text-muted">
            &copy; {new Date().getFullYear()} FinanceAI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
