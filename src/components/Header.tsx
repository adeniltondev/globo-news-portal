import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Menu, User, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Header = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <header className="bg-news-red border-b border-border sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-primary">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-8 text-xs">
            <div className="flex items-center space-x-4 text-primary-foreground">
              <span>São Paulo, {new Date().toLocaleDateString('pt-BR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
            <div className="flex items-center space-x-4">
              {session ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-6 text-primary-foreground hover:bg-primary/80">
                      <User className="h-3 w-3 mr-1" />
                      Área do Jornalista
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-background border border-border shadow-lg">
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        Painel Admin
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSignOut} className="flex items-center">
                      <LogOut className="h-4 w-4 mr-2" />
                      Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link 
                  to="/login" 
                  className="text-primary-foreground hover:text-primary-foreground/80 text-xs"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-news-red-foreground text-news-red font-bold text-2xl px-3 py-1 rounded">
                G1
              </div>
              <span className="text-news-red-foreground font-semibold text-lg">
                PORTAL DE NOTÍCIAS
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="search"
                placeholder="Buscar notícias..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64 bg-background"
              />
            </div>
            <Button variant="ghost" size="icon" className="md:hidden text-news-red-foreground">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Categories Navigation */}
      <nav className="bg-news-red border-t border-border/20">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-6 h-12 overflow-x-auto">
            <Link 
              to="/" 
              className="text-news-red-foreground hover:text-news-red-foreground/80 font-medium whitespace-nowrap text-sm"
            >
              INÍCIO
            </Link>
            <Link 
              to="/categoria/politica" 
              className="text-news-red-foreground hover:text-news-red-foreground/80 font-medium whitespace-nowrap text-sm"
            >
              POLÍTICA
            </Link>
            <Link 
              to="/categoria/economia" 
              className="text-news-red-foreground hover:text-news-red-foreground/80 font-medium whitespace-nowrap text-sm"
            >
              ECONOMIA
            </Link>
            <Link 
              to="/categoria/esportes" 
              className="text-news-red-foreground hover:text-news-red-foreground/80 font-medium whitespace-nowrap text-sm"
            >
              ESPORTES
            </Link>
            <Link 
              to="/categoria/tecnologia" 
              className="text-news-red-foreground hover:text-news-red-foreground/80 font-medium whitespace-nowrap text-sm"
            >
              TECNOLOGIA
            </Link>
            <Link 
              to="/categoria/saude" 
              className="text-news-red-foreground hover:text-news-red-foreground/80 font-medium whitespace-nowrap text-sm"
            >
              SAÚDE
            </Link>
            <Link 
              to="/categoria/mundo" 
              className="text-news-red-foreground hover:text-news-red-foreground/80 font-medium whitespace-nowrap text-sm"
            >
              MUNDO
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};