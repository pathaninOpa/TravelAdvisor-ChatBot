import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative inline-flex h-6 w-11 items-center rounded-full bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background data-[state=checked]:bg-primary"
      style={{
        backgroundColor: isDark ? "hsl(var(--primary))" : "hsl(var(--muted))"
      }}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-background transition-transform duration-200 ease-in-out ${
          isDark ? "translate-x-6" : "translate-x-1"
        }`}
      >
        {isDark ? (
          <Moon className="h-3 w-3 text-primary ml-0.5 mt-0.5" />
        ) : (
          <Sun className="h-3 w-3 text-muted-foreground ml-0.5 mt-0.5" />
        )}
      </span>
    </button>
  );
}