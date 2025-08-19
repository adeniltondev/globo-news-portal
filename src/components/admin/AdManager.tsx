import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Eye, MousePointer } from "lucide-react";

interface Advertisement {
  id: string;
  title: string;
  image_url: string;
  link_url?: string;
  position: string;
  active: boolean;
  clicks: number;
  impressions: number;
  created_at: string;
}

export const AdManager = () => {
  const { toast } = useToast();
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<Advertisement | null>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    image_url: "",
    link_url: "",
    position: "sidebar",
    active: true,
  });

  const positions = [
    { value: "header", label: "Cabeçalho" },
    { value: "sidebar", label: "Barra Lateral" },
    { value: "content", label: "Conteúdo" },
    { value: "footer", label: "Rodapé" },
  ];

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      const { data } = await supabase
        .from("advertisements")
        .select("*")
        .order("created_at", { ascending: false });

      setAds(data || []);
    } catch (error) {
      console.error("Erro ao carregar anúncios:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingAd) {
        const { error } = await supabase
          .from("advertisements")
          .update(formData)
          .eq("id", editingAd.id);

        if (error) throw error;

        toast({
          title: "Anúncio atualizado!",
          description: "O anúncio foi atualizado com sucesso.",
        });
      } else {
        const { error } = await supabase
          .from("advertisements")
          .insert([formData]);

        if (error) throw error;

        toast({
          title: "Anúncio criado!",
          description: "O novo anúncio foi criado com sucesso.",
        });
      }

      setDialogOpen(false);
      setEditingAd(null);
      setFormData({
        title: "",
        image_url: "",
        link_url: "",
        position: "sidebar",
        active: true,
      });
      fetchAds();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (ad: Advertisement) => {
    setEditingAd(ad);
    setFormData({
      title: ad.title,
      image_url: ad.image_url,
      link_url: ad.link_url || "",
      position: ad.position,
      active: ad.active,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este anúncio?")) return;

    try {
      const { error } = await supabase
        .from("advertisements")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Anúncio excluído!",
        description: "O anúncio foi excluído com sucesso.",
      });
      fetchAds();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getPositionLabel = (position: string) => {
    return positions.find(p => p.value === position)?.label || position;
  };

  if (loading && ads.length === 0) {
    return <div className="flex justify-center py-8">Carregando anúncios...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gerenciar Publicidade</h2>
          <p className="text-muted-foreground">
            Configure os anúncios do seu portal
          </p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingAd(null);
              setFormData({
                title: "",
                image_url: "",
                link_url: "",
                position: "sidebar",
                active: true,
              });
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Anúncio
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingAd ? "Editar Anúncio" : "Novo Anúncio"}
              </DialogTitle>
              <DialogDescription>
                {editingAd 
                  ? "Edite as informações do anúncio abaixo." 
                  : "Preencha os dados para criar um novo anúncio."
                }
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image_url">URL da Imagem</Label>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                  placeholder="https://exemplo.com/anuncio.jpg"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="link_url">URL de Destino (opcional)</Label>
                <Input
                  id="link_url"
                  value={formData.link_url}
                  onChange={(e) => setFormData({...formData, link_url: e.target.value})}
                  placeholder="https://exemplo.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="position">Posição</Label>
                <Select 
                  value={formData.position} 
                  onValueChange={(value) => setFormData({...formData, position: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a posição" />
                  </SelectTrigger>
                  <SelectContent>
                    {positions.map((position) => (
                      <SelectItem key={position.value} value={position.value}>
                        {position.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={formData.active}
                  onCheckedChange={(checked) => setFormData({...formData, active: checked})}
                />
                <Label htmlFor="active">Ativo</Label>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Salvando..." : (editingAd ? "Atualizar" : "Criar")}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Estatísticas de Publicidade</CardTitle>
            <CardDescription>
              Resumo do desempenho dos anúncios
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Total de Anúncios:</span>
                <span className="font-semibold">{ads.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Anúncios Ativos:</span>
                <span className="font-semibold">{ads.filter(ad => ad.active).length}</span>
              </div>
              <div className="flex justify-between">
                <span>Total de Impressões:</span>
                <span className="font-semibold">
                  {ads.reduce((sum, ad) => sum + ad.impressions, 0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Total de Cliques:</span>
                <span className="font-semibold">
                  {ads.reduce((sum, ad) => sum + ad.clicks, 0).toLocaleString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Posições dos Anúncios</CardTitle>
            <CardDescription>
              Distribuição por posição
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {positions.map((position) => {
                const count = ads.filter(ad => ad.position === position.value).length;
                return (
                  <div key={position.value} className="flex justify-between">
                    <span>{position.label}:</span>
                    <span className="font-semibold">{count}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Anúncios ({ads.length})</CardTitle>
          <CardDescription>
            Lista de todos os anúncios do portal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Posição</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Impressões</TableHead>
                <TableHead>Cliques</TableHead>
                <TableHead>CTR</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ads.map((ad) => (
                <TableRow key={ad.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={ad.image_url} 
                        alt={ad.title}
                        className="w-10 h-10 object-cover rounded border"
                      />
                      <span className="line-clamp-1">{ad.title}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {getPositionLabel(ad.position)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={ad.active ? "default" : "secondary"}>
                      {ad.active ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Eye className="h-3 w-3 mr-1" />
                      {ad.impressions.toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <MousePointer className="h-3 w-3 mr-1" />
                      {ad.clicks.toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    {ad.impressions > 0 
                      ? `${((ad.clicks / ad.impressions) * 100).toFixed(2)}%`
                      : "0%"
                    }
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(ad)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(ad.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
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