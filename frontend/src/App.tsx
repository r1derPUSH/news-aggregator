import { BrowserRouter, Routes, Route } from "react-router-dom";
import NewsPage from "./pages/NewsPage/NewsPage";
import ArticlePage from "./pages/ArticlePage/ArticlePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<NewsPage />} />
        <Route path="/article/:index" element={<ArticlePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
