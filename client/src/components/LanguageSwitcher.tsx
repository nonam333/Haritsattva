import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

export default function LanguageSwitcher() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <Button
      size="icon"
      variant="ghost"
      onClick={toggleLanguage}
      data-testid="button-language-toggle"
      aria-label="Toggle language"
      title={language === "en" ? "Switch to Hindi" : "Switch to English"}
    >
      <div className="flex items-center gap-1 text-xs font-semibold">
        <Languages className="w-4 h-4" />
        <span>{language === "en" ? "HI" : "EN"}</span>
      </div>
    </Button>
  );
}
