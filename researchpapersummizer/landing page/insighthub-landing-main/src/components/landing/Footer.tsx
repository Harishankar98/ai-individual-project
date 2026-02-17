import { FileText } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                <FileText className="w-5 h-5 text-accent-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">InsightHub</span>
            </div>
            <p className="text-muted-foreground text-sm">
              AI-powered research paper analysis for academics and professionals.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Product</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Features</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Pricing</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">API</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Changelog</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Documentation</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Help Center</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Blog</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Community</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Company</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">About</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Careers</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Privacy</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Terms</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © 2024 InsightHub. All rights reserved.
          </p>
          <p className="text-muted-foreground text-sm">
            Powered by AI
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
