import { motion } from "framer-motion";
import { FileText, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-md border-b border-border"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
              <FileText className="w-5 h-5 text-accent-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">InsightHub</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
              Dashboard
            </a>
            <a href="#upload" className="text-muted-foreground hover:text-foreground transition-colors">
              Upload Paper
            </a>
            <a href="#summarizer" className="text-muted-foreground hover:text-foreground transition-colors">
              Summarizer & Insights
            </a>
            <a href="#search" className="text-muted-foreground hover:text-foreground transition-colors">
              Semantic Search
            </a>
            <a href="#chatbot" className="text-muted-foreground hover:text-foreground transition-colors">
              Chatbot
            </a>
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center">
            <Button variant="accent" size="sm">
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-foreground" />
            ) : (
              <Menu className="w-6 h-6 text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden py-4 border-t border-border"
          >
            <nav className="flex flex-col gap-4">
              <a href="#dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
                Dashboard
              </a>
              <a href="#upload" className="text-muted-foreground hover:text-foreground transition-colors">
                Upload Paper
              </a>
              <a href="#summarizer" className="text-muted-foreground hover:text-foreground transition-colors">
                Summarizer & Insights
              </a>
              <a href="#search" className="text-muted-foreground hover:text-foreground transition-colors">
                Semantic Search
              </a>
              <a href="#chatbot" className="text-muted-foreground hover:text-foreground transition-colors">
                Chatbot
              </a>
              <div className="pt-4 border-t border-border">
                <Button variant="accent" size="sm" className="w-full">
                  Get Started
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
};

export default Header;
