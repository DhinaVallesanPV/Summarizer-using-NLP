
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Sliders, FileText, MessageSquare, Pencil } from "lucide-react";

export interface SummaryPreferences {
  length: string;
  fluency: "professional" | "simplified" | "technical";
  customLength?: number;
}

interface SummaryPreferencesProps {
  preferences: SummaryPreferences;
  onPreferencesChange: (preferences: SummaryPreferences) => void;
}

const SummaryPreferencesPanel: React.FC<SummaryPreferencesProps> = ({
  preferences,
  onPreferencesChange,
}) => {
  const [useCustom, setUseCustom] = useState(preferences.length === "custom");
  const [customValue, setCustomValue] = useState<number>(preferences.customLength || 500);
  const [customError, setCustomError] = useState("");

  const handleLengthChange = (value: string) => {
    if (value === "custom") {
      setUseCustom(true);
      onPreferencesChange({ ...preferences, length: "custom", customLength: customValue });
    } else {
      setUseCustom(false);
      onPreferencesChange({ ...preferences, length: value, customLength: undefined });
    }
  };

  const handleCustomChange = (val: string) => {
    const num = parseInt(val);
    if (isNaN(num)) {
      setCustomError("Enter a valid number");
      return;
    }
    setCustomValue(num);
    if (num < 500) {
      setCustomError("Minimum 500 words");
    } else if (num > 3500) {
      setCustomError("Maximum 3500 words");
    } else {
      setCustomError("");
      onPreferencesChange({ ...preferences, length: "custom", customLength: num });
    }
  };

  const lengthOptions = [
    { value: "400", label: "300–500", desc: "Brief overview" },
    { value: "800", label: "800", desc: "Standard" },
    { value: "1500", label: "1500", desc: "Detailed" },
    { value: "custom", label: "Custom", desc: "500–3500 words" },
  ];

  const toneOptions = [
    { value: "professional", label: "Professional", desc: "Formal, research-style", icon: "🎓" },
    { value: "simplified", label: "Simplified", desc: "Easy to understand", icon: "💡" },
    { value: "technical", label: "Technical", desc: "Preserve terminology", icon: "⚙️" },
  ];

  return (
    <div className="space-y-6">
      {/* Length Control */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-lg gradient-bg flex items-center justify-center">
            <FileText className="h-3.5 w-3.5 text-primary-foreground" />
          </div>
          <Label className="font-display font-semibold text-sm text-foreground">Summary Length</Label>
        </div>
        <RadioGroup
          value={useCustom ? "custom" : preferences.length}
          onValueChange={handleLengthChange}
          className="grid grid-cols-2 gap-2"
        >
          {lengthOptions.map((opt) => (
            <label
              key={opt.value}
              htmlFor={`len-${opt.value}`}
              className={`relative flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:border-primary/50 ${
                (useCustom ? "custom" : preferences.length) === opt.value
                  ? "border-primary bg-accent shadow-sm"
                  : "border-border bg-card hover:bg-accent/30"
              }`}
            >
              <RadioGroupItem value={opt.value} id={`len-${opt.value}`} className="sr-only" />
              <div>
                <span className="font-medium text-sm text-foreground">{opt.label}</span>
                <span className="block text-xs text-muted-foreground">{opt.desc}</span>
              </div>
            </label>
          ))}
        </RadioGroup>
        {useCustom && (
          <div className="mt-3 animate-fade-in">
            <div className="relative">
              <Pencil className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                type="number"
                min={500}
                max={3500}
                value={customValue}
                onChange={(e) => handleCustomChange(e.target.value)}
                className="pl-9 text-sm"
                placeholder="Enter word count (500-3500)"
              />
            </div>
            {customError && <p className="text-xs text-destructive mt-1">{customError}</p>}
          </div>
        )}
      </div>

      {/* Tone Selection */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-lg gradient-bg flex items-center justify-center">
            <MessageSquare className="h-3.5 w-3.5 text-primary-foreground" />
          </div>
          <Label className="font-display font-semibold text-sm text-foreground">Tone</Label>
        </div>
        <RadioGroup
          value={preferences.fluency}
          onValueChange={(value) =>
            onPreferencesChange({ ...preferences, fluency: value as "professional" | "simplified" | "technical" })
          }
          className="space-y-2"
        >
          {toneOptions.map((opt) => (
            <label
              key={opt.value}
              htmlFor={`tone-${opt.value}`}
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:border-primary/50 ${
                preferences.fluency === opt.value
                  ? "border-primary bg-accent shadow-sm"
                  : "border-border bg-card hover:bg-accent/30"
              }`}
            >
              <RadioGroupItem value={opt.value} id={`tone-${opt.value}`} className="sr-only" />
              <span className="text-lg">{opt.icon}</span>
              <div>
                <span className="font-medium text-sm text-foreground">{opt.label}</span>
                <span className="block text-xs text-muted-foreground">{opt.desc}</span>
              </div>
            </label>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
};

export default SummaryPreferencesPanel;
