import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const API_KEY = import.meta.env.VITE_NEWS_API_KEY;

function NewsPage() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [selectedSource, setSelectedSource] = useState("all");
  const [sortOrder, setSortOrder] = useState("desc");

  const { data: sources } = useQuery({
    queryKey: ["sources"],
    queryFn: async () => {
      const res = await fetch("http://localhost:1337/api/sources");
      const data = await res.json();
      return data.data;
    },
  });

  const allowedSourcesSlugs = sources?.map((source: any) => source.slug) ?? [];

  const { data: topics } = useQuery({
    queryKey: ["topics"],
    queryFn: async () => {
      const res = await fetch("http://localhost:1337/api/topics");
      const data = await res.json();
      return data.data;
    },
  });

  const query = topics
    ?.filter((t: any) => t.isEnabled)
    .map((t: any) => t.query)
    .join(" OR ");

  const { data: newsData, isLoading } = useQuery({
    queryKey: ["news", query],
    queryFn: async () => {
      const res = await fetch(
        `https://newsapi.org/v2/everything?q=${query}&sources=${allowedSourcesSlugs.join(
          ",",
        )}&pageSize=80&sortBy=publishedAt&apiKey=${API_KEY}`,
      );
      return res.json();
    },
    enabled: !!query && allowedSourcesSlugs.length > 0,
  });

  const processedArticles =
    newsData?.articles
      ?.filter((item: any) => {
        if (selectedSource === "all") return true;
        return item.source.id === selectedSource;
      })
      .filter((item: any) =>
        item.title.toLowerCase().includes(search.toLowerCase()),
      )
      .sort((a: any, b: any) => {
        const dateA = new Date(a.publishedAt).getTime();
        const dateB = new Date(b.publishedAt).getTime();
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      }) ?? [];

  const articlesWithTopic =
    processedArticles.map((article: any) => {
      const text = article.title.toLowerCase();

      const matchedTopic = topics?.find((topic: any) => {
        let keywords = topic.keywords;

        if (typeof keywords === "string") {
          try {
            keywords = JSON.parse(keywords);
          } catch {
            return false;
          }
        }

        return keywords?.some((keyword: string) =>
          text.includes(keyword.toLowerCase()),
        );
      });

      return {
        ...article,
        topic: matchedTopic?.name ?? "Other",
      };
    }) ?? [];

  return (
    <div className="min-h-screen bg-background px-6 py-10">
      <div className="mx-auto max-w-4xl space-y-8">
        <h1 className="text-4xl font-bold">News Feed</h1>

        {/* Filters */}
        <div className="flex flex-col gap-4 md:flex-row">
          <Input
            placeholder="Search by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <Select
            value={selectedSource}
            onValueChange={(value) => setSelectedSource(value)}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="All sources" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All sources</SelectItem>
              {allowedSourcesSlugs.map((src: string) => (
                <SelectItem key={src} value={src}>
                  {src}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={sortOrder}
            onValueChange={(value) => setSortOrder(value)}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Newest first</SelectItem>
              <SelectItem value="asc">Oldest first</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading && <p>Loading...</p>}

        {/* Articles */}
        <div className="space-y-6">
          {articlesWithTopic.map((article: any, index: number) => (
            <Card
              key={index}
              className="cursor-pointer transition hover:shadow-lg"
              onClick={() => navigate(`/article/${index}`, { state: article })}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{article.title}</CardTitle>
                  <Badge variant="secondary">{article.topic}</Badge>
                </div>
              </CardHeader>

              <CardContent>
                <p className="text-muted-foreground mb-4">
                  {article.description}
                </p>
                <p className="text-sm text-muted-foreground">
                  {article.source.name} •{" "}
                  {new Date(article.publishedAt).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default NewsPage;
