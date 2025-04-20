
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface SummaryPreferences {
  length: "300" | "500" | "700";
  fluency: "basic" | "standard" | "professional";
}

interface SummaryPreferencesProps {
  preferences: SummaryPreferences;
  onPreferencesChange: (preferences: SummaryPreferences) => void;
}

const SummaryPreferences: React.FC<SummaryPreferencesProps> = ({
  preferences,
  onPreferencesChange,
}) => {
  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <CardTitle className="text-lg">Summary Preferences</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label>Summary Length (words)</Label>
          <RadioGroup
            value={preferences.length}
            onValueChange={(value) =>
              onPreferencesChange({ ...preferences, length: value as "300" | "500" | "700" })
            }
            className="flex flex-col space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="300" id="words-300" />
              <Label htmlFor="words-300">300 words (Brief)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="500" id="words-500" />
              <Label htmlFor="words-500">500 words (Standard)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="700" id="words-700" />
              <Label htmlFor="words-700">700 words (Detailed)</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-3">
          <Label>Writing Style</Label>
          <RadioGroup
            value={preferences.fluency}
            onValueChange={(value) =>
              onPreferencesChange({ ...preferences, fluency: value as "basic" | "standard" | "professional" })
            }
            className="flex flex-col space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="basic" id="fluency-basic" />
              <Label htmlFor="fluency-basic">Basic (Simple and clear)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="standard" id="fluency-standard" />
              <Label htmlFor="fluency-standard">Standard (Balanced)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="professional" id="fluency-professional" />
              <Label htmlFor="fluency-professional">Professional (Academic style)</Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
};

export default SummaryPreferences;
