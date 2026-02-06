import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function ArticlePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const article: any = location.state;

  if (!article) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Article not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-6 py-10">
      <div className="mx-auto max-w-3xl space-y-6">
        <Button variant="ghost" onClick={() => navigate("/")}>
          ← Back
        </Button>

        <Card>
          <CardContent className="space-y-6 p-6">
            <div className="space-y-3">
              <h1 className="text-3xl font-bold leading-tight">
                {article.title}
              </h1>

              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Badge variant="secondary">{article.topic ?? "Other"}</Badge>

                <span>{article.source.name}</span>

                <span>
                  {new Date(article.publishedAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            {article.urlToImage && (
              <img
                src={article.urlToImage}
                alt={article.title}
                className="w-full rounded-xl object-cover"
              />
            )}

            <p className="text-base leading-relaxed text-muted-foreground">
              {article.content || article.description}
            </p>

            <Button asChild>
              <a href={article.url} target="_blank" rel="noreferrer">
                Read full article →
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default ArticlePage;
