import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Activity, User, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/#about" },
  { label: "Features", href: "/#features" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Security", href: "/#security" },
  { label: "Contact", href: "/#contact" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-blue-500 shadow-md shadow-primary/20">
            <Activity className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-primary bg-clip-text text-transparent">
            MediNexus AI
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                location.pathname === item.href || (item.href === "/" && location.pathname === "/" && !location.hash)
                  ? "text-foreground font-semibold"
                  : "text-muted-foreground"
              )}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Desktop Right Side Buttons */}
        <div className="hidden items-center gap-3 md:flex">
          <Button variant="outline" size="sm" asChild className="gap-1.5 border-primary/20 hover:border-primary/40 hover:bg-primary/5">
            <Link to="/patient-auth">
              <User className="h-4 w-4 text-primary" />
              Patient Login
            </Link>
          </Button>
          <Button size="sm" asChild className="gap-1.5 shadow-md shadow-primary/20">
            <Link to="/auth">
              <Building2 className="h-4 w-4" />
              Hospital Login
            </Link>
          </Button>
        </div>

        {/* Mobile Navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px]">
            <div className="flex flex-col gap-6 pt-6">
              <Link to="/" className="flex items-center gap-2.5" onClick={() => setIsOpen(false)}>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-blue-500 text-primary-foreground shadow-md">
                  <Activity className="h-5 w-5" />
                </div>
                <span className="text-xl font-bold">MediNexus AI</span>
              </Link>
              <nav className="flex flex-col gap-4">
                {navItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="text-lg font-medium text-muted-foreground transition-colors hover:text-primary"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
              <div className="flex flex-col gap-3 pt-4 border-t">
                <Button variant="outline" asChild className="justify-start gap-2">
                  <Link to="/patient-auth" onClick={() => setIsOpen(false)}>
                    <User className="h-4 w-4" />
                    Patient Login
                  </Link>
                </Button>
                <Button asChild className="justify-start gap-2">
                  <Link to="/auth" onClick={() => setIsOpen(false)}>
                    <Building2 className="h-4 w-4" />
                    Hospital Login
                  </Link>
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Navbar;
