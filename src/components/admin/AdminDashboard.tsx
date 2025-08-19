import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { FileText, Eye, Megaphone, TrendingUp } from "lucide-react";

interface DashboardStats {
  totalPosts: number;
  publishedPosts: number;
  totalViews: number;
  totalAds: number;
}

export const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalPosts: 0,
    publishedPosts: 0,
    totalViews: 0,
    totalAds: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get posts stats
        const { count: totalPosts } = await supabase
          .from("posts")
          .select("*", { count: "exact", head: true });

        const { count: publishedPosts } = await supabase
          .from("posts")
          .select("*", { count: "exact", head: true })
          .eq("published", true);

        // Get total views
        const { data: viewsData } = await supabase
          .from("posts")
          .select("views")
          .eq("published", true);

        const totalViews = viewsData?.reduce((sum, post) => sum + post.views, 0) || 0;

        // Get ads count
        const { count: totalAds } = await supabase
          .from("advertisements")
          .select("*", { count: "exact", head: true });

        setStats({
          totalPosts: totalPosts || 0,
          publishedPosts: publishedPosts || 0,
          totalViews,
          totalAds: totalAds || 0,
        });
      } catch (error) {
        console.error("Erro ao carregar estatísticas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-muted animate-pulse rounded w-20"></div>
              <div className="h-4 w-4 bg-muted animate-pulse rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted animate-pulse rounded w-16 mb-1"></div>
              <div className="h-3 bg-muted animate-pulse rounded w-24"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: "Total de Posts",
      value: stats.totalPosts,
      description: `${stats.publishedPosts} publicados`,
      icon: FileText,
      color: "text-blue-600",
    },
    {
      title: "Visualizações",
      value: stats.totalViews.toLocaleString(),
      description: "Total de visualizações",
      icon: Eye,
      color: "text-green-600",
    },
    {
      title: "Publicidade",
      value: stats.totalAds,
      description: "Anúncios ativos",
      icon: Megaphone,
      color: "text-purple-600",
    },
    {
      title: "Engajamento",
      value: stats.publishedPosts > 0 ? Math.round(stats.totalViews / stats.publishedPosts) : 0,
      description: "Média de views por post",
      icon: TrendingUp,
      color: "text-orange-600",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Visão geral do seu portal de notícias
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">
                {card.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>
              Atalhos para as principais funcionalidades
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex flex-col space-y-2">
              <button 
                className="text-left p-2 rounded hover:bg-muted transition-colors"
                onClick={() => {
                  const postTab = document.querySelector('[data-value="posts"]') as HTMLElement;
                  postTab?.click();
                }}
              >
                📝 Criar novo post
              </button>
              <button 
                className="text-left p-2 rounded hover:bg-muted transition-colors"
                onClick={() => {
                  const categoryTab = document.querySelector('[data-value="categories"]') as HTMLElement;
                  categoryTab?.click();
                }}
              >
                🏷️ Gerenciar categorias
              </button>
              <button 
                className="text-left p-2 rounded hover:bg-muted transition-colors"
                onClick={() => {
                  const adTab = document.querySelector('[data-value="ads"]') as HTMLElement;
                  adTab?.click();
                }}
              >
                📢 Configurar publicidade
              </button>
              <button 
                className="text-left p-2 rounded hover:bg-muted transition-colors"
                onClick={() => {
                  const reportTab = document.querySelector('[data-value="reports"]') as HTMLElement;
                  reportTab?.click();
                }}
              >
                📊 Ver relatórios
              </button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Atividade Recente</CardTitle>
            <CardDescription>
              Últimas ações no sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Sistema inicializado</span>
                <span className="text-muted-foreground">Agora</span>
              </div>
              <div className="flex justify-between">
                <span>Categorias configuradas</span>
                <span className="text-muted-foreground">Hoje</span>
              </div>
              <div className="flex justify-between">
                <span>Portal de notícias criado</span>
                <span className="text-muted-foreground">Hoje</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};