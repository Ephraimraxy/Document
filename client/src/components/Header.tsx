import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";
import { Link } from "wouter";

interface HeaderProps {
  title: string;
  subtitle: string;
  onSearch?: (query: string) => void;
}

export default function Header({ title, subtitle, onSearch }: HeaderProps) {
  return (
    <header className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground" data-testid="page-title">
            {title}
          </h1>
          <p className="text-muted-foreground" data-testid="page-subtitle">
            {subtitle}
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search documents..."
              className="w-64 pl-10"
              onChange={(e) => onSearch?.(e.target.value)}
              data-testid="input-search"
            />
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          </div>

          <Link href="/create">
            <Button data-testid="button-new-document">
              <Plus className="mr-2 h-4 w-4" />
              New Document
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
