import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Eye, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface NewsCardProps {
  post: {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    featured_image?: string;
    views: number;
    created_at: string;
    category?: {
      name: string;
      slug: string;
      color: string;
    };
    profile?: {
      full_name?: string;
    } | null;
  };
  featured?: boolean;
}

export const NewsCard = ({ post, featured = false }: NewsCardProps) => {
  const getCategoryColor = (categorySlug?: string) => {
    const colors = {
      politica: "bg-category-politica",
      economia: "bg-category-economia", 
      esportes: "bg-category-esportes",
      tecnologia: "bg-category-tecnologia",
      saude: "bg-category-saude",
      mundo: "bg-category-mundo",
    };
    return colors[categorySlug as keyof typeof colors] || "bg-primary";
  };

  if (featured) {
    return (
      <article className="group cursor-pointer">
        <Link to={`/noticia/${post.slug}`} className="block">
          <div className="relative overflow-hidden rounded-lg bg-card">
            {post.featured_image && (
              <img
                src={post.featured_image}
                alt={post.title}
                className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              {post.category && (
                <Badge 
                  className={`${getCategoryColor(post.category.slug)} text-white mb-3 hover:${getCategoryColor(post.category.slug)}/90`}
                >
                  {post.category.name.toUpperCase()}
                </Badge>
              )}
              <h2 className="text-2xl font-bold mb-2 group-hover:underline">
                {post.title}
              </h2>
              <p className="text-white/90 text-base mb-3 line-clamp-2">
                {post.excerpt}
              </p>
              <div className="flex items-center justify-between text-sm text-white/80">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {formatDistanceToNow(new Date(post.created_at), {
                      addSuffix: true,
                      locale: ptBR,
                    })}
                  </span>
                  <span className="flex items-center">
                    <Eye className="h-4 w-4 mr-1" />
                    {post.views}
                  </span>
                </div>
                {post.profile?.full_name && (
                  <span>Por {post.profile.full_name}</span>
                )}
              </div>
            </div>
          </div>
        </Link>
      </article>
    );
  }

  return (
    <article className="group cursor-pointer bg-card rounded-lg overflow-hidden border border-border hover:shadow-lg transition-shadow">
      <Link to={`/noticia/${post.slug}`} className="block">
        {post.featured_image && (
          <div className="aspect-video overflow-hidden">
            <img
              src={post.featured_image}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        <div className="p-4">
          {post.category && (
            <Badge 
              className={`${getCategoryColor(post.category.slug)} text-white mb-3 hover:${getCategoryColor(post.category.slug)}/90`}
            >
              {post.category.name.toUpperCase()}
            </Badge>
          )}
          <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </h3>
          <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
            {post.excerpt}
          </p>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center space-x-3">
              <span className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {formatDistanceToNow(new Date(post.created_at), {
                  addSuffix: true,
                  locale: ptBR,
                })}
              </span>
              <span className="flex items-center">
                <Eye className="h-3 w-3 mr-1" />
                {post.views}
              </span>
            </div>
            {post.profile?.full_name && (
              <span>Por {post.profile.full_name}</span>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
};