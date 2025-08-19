import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { NewsCard } from "@/components/NewsCard";
import { AdBanner } from "@/components/AdBanner";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featured_image?: string;
  views: number;
  created_at: string;
  featured: boolean;
  category?: {
    name: string;
    slug: string;
    color: string;
  };
  profile?: {
    full_name?: string;
  } | null;
}

const Index = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [featuredPosts, setFeaturedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Fetch featured posts
        const { data: featured } = await supabase
          .from("posts")
          .select(`
            *,
            categories(name, slug, color)
          `)
          .eq("published", true)
          .eq("featured", true)
          .order("created_at", { ascending: false })
          .limit(3);

        // Fetch regular posts
        const { data: regular } = await supabase
          .from("posts")
          .select(`
            *,
            categories(name, slug, color)
          `)
          .eq("published", true)
          .eq("featured", false)
          .order("created_at", { ascending: false })
          .limit(12);

        setFeaturedPosts((featured || []).map(post => ({
          ...post,
          category: post.categories
        })));
        setPosts((regular || []).map(post => ({
          ...post,
          category: post.categories
        })));
      } catch (error) {
        console.error("Erro ao carregar posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const LoadingSkeleton = () => (
    <div className="space-y-6">
      <Skeleton className="h-80 w-full rounded-lg" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-48 w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header Ad */}
        <AdBanner position="header" className="mb-8" />

        {loading ? (
          <LoadingSkeleton />
        ) : (
          <>
            {/* Featured News Section */}
            {featuredPosts.length > 0 && (
              <section className="mb-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Main Featured Post */}
                  <div className="lg:col-span-1">
                    <NewsCard post={featuredPosts[0]} featured />
                  </div>
                  
                  {/* Secondary Featured Posts */}
                  <div className="space-y-6">
                    {featuredPosts.slice(1, 3).map((post) => (
                      <NewsCard key={post.id} post={post} />
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Latest News Grid */}
            <section>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-foreground">ÚLTIMAS NOTÍCIAS</h2>
                <div className="h-1 flex-1 bg-news-red ml-4"></div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* News Grid */}
                <div className="lg:col-span-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {posts.map((post) => (
                      <NewsCard key={post.id} post={post} />
                    ))}
                  </div>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1 space-y-8">
                  <AdBanner position="sidebar" />
                  
                  {/* Most Popular */}
                  <div className="bg-card rounded-lg p-6 border border-border">
                    <h3 className="font-bold text-lg mb-4 text-foreground">MAIS POPULARES</h3>
                    <div className="space-y-4">
                      {posts
                        .sort((a, b) => b.views - a.views)
                        .slice(0, 5)
                        .map((post, index) => (
                          <div key={post.id} className="flex items-start space-x-3">
                            <span className="text-news-red font-bold text-lg min-w-[2rem]">
                              {index + 1}
                            </span>
                            <div>
                              <h4 className="text-sm font-medium line-clamp-2 hover:text-primary">
                                <a href={`/noticia/${post.slug}`}>{post.title}</a>
                              </h4>
                              <p className="text-xs text-muted-foreground mt-1">
                                {post.views} visualizações
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  <AdBanner position="content" />
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Index;
