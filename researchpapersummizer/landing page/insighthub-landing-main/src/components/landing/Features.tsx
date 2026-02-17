import { motion } from "framer-motion";
import { FileText, Search, MessageSquare, Lightbulb, LayoutDashboard, Upload } from "lucide-react";

const features = [
  {
    icon: Upload,
    title: "Easy Upload",
    description: "Simply drag and drop your research papers. We support PDF files up to 10MB with instant processing.",
  },
  {
    icon: FileText,
    title: "Smart Summarizer",
    description: "Get concise, accurate summaries of your research papers powered by advanced AI technology.",
  },
  {
    icon: Lightbulb,
    title: "Key Insights",
    description: "Automatically extract methodology, findings, and conclusions from your uploaded papers.",
  },
  {
    icon: Search,
    title: "Semantic Search",
    description: "Search across all your papers using natural language. Find exactly what you need instantly.",
  },
  {
    icon: MessageSquare,
    title: "Chat with AI",
    description: "Ask questions about your research and get intelligent answers with citations.",
  },
  {
    icon: LayoutDashboard,
    title: "Dashboard",
    description: "Organize and manage all your research papers in one beautiful, intuitive interface.",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Everything You Need for Research
          </h2>
          <p className="text-lg text-muted-foreground">
            Powerful features designed to help you understand and organize academic papers efficiently.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-card rounded-2xl p-8 shadow-card border border-border hover:shadow-elevated hover:border-accent/20 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                <feature.icon className="w-7 h-7 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
