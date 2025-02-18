import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "./lib/auth";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Planet from "@/pages/planet";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { AuthForms } from "@/components/auth-forms";

function UserMenu() {
  const { user, logout } = useAuth();

  if (!user) {
    return <AuthForms />;
  }

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm text-muted-foreground">
        Welcome, {user.username}
      </span>
      <Button variant="outline" onClick={logout}>
        Logout
      </Button>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/planet/:id" component={Planet} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="min-h-screen bg-background">
          <header className="border-b p-4">
            <div className="max-w-7xl mx-auto flex justify-end">
              <UserMenu />
            </div>
          </header>
          <main>
            <Router />
          </main>
        </div>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;