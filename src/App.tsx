import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Strategy from "./pages/Strategy";
import Wallet from "./pages/Wallet";
import Backtest from "./pages/Backtest";
import Vision from "./pages/Vision";
import Journal from "./pages/Journal";
import Navbar from "./components/ui/Navbar";
import Footer from "./components/ui/Footer";
import "./styles/journal.css";

const queryClient = new QueryClient();

const Layout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col min-h-screen bg-black text-white">
    <Navbar />
    <main className="flex-grow pt-20 pb-10">{children}</main>
    <Footer />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <Layout>
              <Index />
            </Layout>
          } />
          <Route path="/strategy" element={
            <Layout>
              <Strategy />
            </Layout>
          } />
          <Route path="/vision" element={
            <Layout>
              <Vision />
            </Layout>
          } />
          <Route path="/journal" element={
            <Layout>
              <Journal />
            </Layout>
          } />
          <Route path="/academy" element={
            <Layout>
              <div className="container mx-auto p-4"><h2>Academy Page (Stub)</h2></div>
            </Layout>
          } />
          <Route path="/wallet" element={
            <Layout>
              <Wallet />
            </Layout>
          } />
          <Route path="/backtest" element={
            <Layout>
              <Backtest />
            </Layout>
          } />
          <Route path="/support" element={
            <Layout>
              <div className="container mx-auto p-4"><h2>Support Page (Stub)</h2></div>
            </Layout>
          } />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={
            <Layout>
              <NotFound />
            </Layout>
          } />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
