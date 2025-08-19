import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Eye, TrendingUp, Calendar, FileText } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ReportData {
  totalPosts: number;
  publishedPosts: number;
  totalViews: number;
  avgViewsPerPost: number;
  topPosts: Array<{
    id: string;
    title: string;
    views: number;
    created_at: string;
    categories?: { name: string; color: string };
  }>;
  categoryStats: Array<{
    name: string;
    color: string;
    post_count: number;
    total_views: number;
  }>;
  recentActivity: Array<{
    id: string;
    title: string;
    created_at: string;
    published: boolean;
  }>;
}

export const ReportsView = () => {
  const [reportData, setReportData] = useState<ReportData>({
    totalPosts: 0,
    publishedPosts: 0,
    totalViews: 0,
    avgViewsPerPost: 0,
    topPosts: [],
    categoryStats: [],
    recentActivity: [],
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("all");

  useEffect(() => {
    fetchReportData();
  }, [timeRange]);

  const fetchReportData = async () => {
    try {
      // Basic stats
      const { count: totalPosts } = await supabase
        .from("posts")
        .select("*", { count: "exact", head: true });

      const { count: publishedPosts } = await supabase
        .from("posts")
        .select("*", { count: "exact", head: true })
        .eq("published", true);

      // Total views
      const { data: viewsData } = await supabase
        .from("posts")
        .select("views")
        .eq("published", true);

      const totalViews = viewsData?.reduce((sum, post) => sum + post.views, 0) || 0;
      const avgViewsPerPost = publishedPosts ? Math.round(totalViews / publishedPosts) : 0;

      // Top posts by views
      const { data: topPosts } = await supabase
        .from("posts")
        .select(`
          id,
          title,
          views,
          created_at,
          categories(name, color)
        `)
        .eq("published", true)
        .order("views", { ascending: false })
        .limit(10);

      // Category statistics
      const { data: categories } = await supabase
        .from("categories")
        .select(`
          name,
          color,
          posts(id, views)
        `);

      const categoryStats = categories?.map(category => ({
        name: category.name,
        color: category.color,
        post_count: category.posts?.length || 0,
        total_views: category.posts?.reduce((sum: number, post: any) => sum + (post.views || 0), 0) || 0,
      })) || [];

      // Recent activity
      const { data: recentActivity } = await supabase
        .from("posts")
        .select("id, title, created_at, published")
        .order("created_at", { ascending: false })
        .limit(10);

      setReportData({
        totalPosts: totalPosts || 0,
        publishedPosts: publishedPosts || 0,
        totalViews,
        avgViewsPerPost,
        topPosts: topPosts || [],
        categoryStats,
        recentActivity: recentActivity || [],
      });
    } catch (error) {
      console.error("Erro ao carregar relatórios:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
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
      </div>
    );
  }

  const summaryCards = [
    {
      title: "Total de Posts",
      value: reportData.totalPosts,
      description: `${reportData.publishedPosts} publicados`,
      icon: FileText,
      color: "text-blue-600",
    },
    {
      title: "Total de Visualizações",
      value: reportData.totalViews.toLocaleString(),
      description: "Todas as visualizações",
      icon: Eye,
      color: "text-green-600",
    },
    {
      title: "Média por Post",
      value: reportData.avgViewsPerPost,
      description: "Visualizações médias",
      icon: TrendingUp,
      color: "text-orange-600",
    },
    {
      title: "Categorias Ativas",
      value: reportData.categoryStats.length,
      description: "Com posts publicados",
      icon: Calendar,
      color: "text-purple-600",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Relatórios</h2>
          <p className="text-muted-foreground">
            Análise detalhada do desempenho do portal
          </p>
        </div>
        
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os tempos</SelectItem>
            <SelectItem value="7d">Últimos 7 dias</SelectItem>
            <SelectItem value="30d">Últimos 30 dias</SelectItem>
            <SelectItem value="90d">Últimos 90 dias</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map((card) => (
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

      <div className="grid gap-6 md:grid-cols-2">
        {/* Top Posts */}
        <Card>
          <CardHeader>
            <CardTitle>Posts Mais Visualizados</CardTitle>
            <CardDescription>
              Ranking dos posts com mais visualizações
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Post</TableHead>
                  <TableHead>Views</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportData.topPosts.slice(0, 5).map((post, index) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-bold text-news-red">
                      {index + 1}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium line-clamp-1">{post.title}</p>
                        {post.categories && (
                          <Badge 
                            style={{ backgroundColor: post.categories.color }}
                            className="text-white text-xs mt-1"
                          >
                            {post.categories.name}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Eye className="h-3 w-3 mr-1" />
                        {post.views.toLocaleString()}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Category Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Desempenho por Categoria</CardTitle>
            <CardDescription>
              Estatísticas de visualizações por categoria
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Posts</TableHead>
                  <TableHead>Views</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportData.categoryStats
                  .sort((a, b) => b.total_views - a.total_views)
                  .map((category) => (
                  <TableRow key={category.name}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded"
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="font-medium">{category.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{category.post_count}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Eye className="h-3 w-3 mr-1" />
                        {category.total_views.toLocaleString()}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Atividade Recente</CardTitle>
          <CardDescription>
            Últimos posts criados no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Criado em</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reportData.recentActivity.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium line-clamp-1">
                    {post.title}
                  </TableCell>
                  <TableCell>
                    <Badge variant={post.published ? "default" : "secondary"}>
                      {post.published ? "Publicado" : "Rascunho"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {formatDistanceToNow(new Date(post.created_at), {
                      addSuffix: true,
                      locale: ptBR,
                    })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};