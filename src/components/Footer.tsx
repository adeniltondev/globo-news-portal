import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="bg-news-red text-news-red-foreground font-bold text-2xl px-3 py-1 rounded">
                G1
              </div>
              <span className="font-semibold text-lg">PORTAL DE NOTÍCIAS</span>
            </Link>
            <p className="text-primary-foreground/80 mb-4">
              O maior portal de notícias do Brasil. Informação de qualidade, 
              confiável e atualizada 24 horas por dia.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-primary-foreground/60 hover:text-primary-foreground">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-primary-foreground/60 hover:text-primary-foreground">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-primary-foreground/60 hover:text-primary-foreground">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-primary-foreground/60 hover:text-primary-foreground">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold mb-4">Categorias</h3>
            <ul className="space-y-2 text-primary-foreground/80">
              <li>
                <Link to="/categoria/politica" className="hover:text-primary-foreground">
                  Política
                </Link>
              </li>
              <li>
                <Link to="/categoria/economia" className="hover:text-primary-foreground">
                  Economia
                </Link>
              </li>
              <li>
                <Link to="/categoria/esportes" className="hover:text-primary-foreground">
                  Esportes
                </Link>
              </li>
              <li>
                <Link to="/categoria/tecnologia" className="hover:text-primary-foreground">
                  Tecnologia
                </Link>
              </li>
              <li>
                <Link to="/categoria/saude" className="hover:text-primary-foreground">
                  Saúde
                </Link>
              </li>
              <li>
                <Link to="/categoria/mundo" className="hover:text-primary-foreground">
                  Mundo
                </Link>
              </li>
            </ul>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold mb-4">Links Úteis</h3>
            <ul className="space-y-2 text-primary-foreground/80">
              <li>
                <Link to="/sobre" className="hover:text-primary-foreground">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link to="/contato" className="hover:text-primary-foreground">
                  Contato
                </Link>
              </li>
              <li>
                <Link to="/privacidade" className="hover:text-primary-foreground">
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link to="/termos" className="hover:text-primary-foreground">
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-primary-foreground">
                  Área do Jornalista
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-primary-foreground/60">
          <p>
            © {new Date().getFullYear()} Portal de Notícias G1. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};