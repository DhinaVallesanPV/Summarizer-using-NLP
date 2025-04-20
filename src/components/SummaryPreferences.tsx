
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, FileText, MessageSquare } from "lucide-react";

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
    <Card className="w-full shadow-md bg-white/80 backdrop-blur-sm border-indigo-100 hover:bg-white/90 transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-t-lg">
        <CardTitle className="text-lg flex items-center gap-2">
          <Settings className="w-5 h-5" />
          <span>Summary Preferences</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-2 text-indigo-800">
            <FileText className="h-4 w-4" />
            <Label className="font-medium">Summary Length</Label>
          </div>
          <RadioGroup
            value={preferences.length}
            onValueChange={(value) =>
              onPreferencesChange({ ...preferences, length: value as "300" | "500" | "700" })
            }
            className="flex flex-col space-y-2"
          >
            <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-indigo-50 transition-colors cursor-pointer">
              <RadioGroupItem value="300" id="words-300" className="text-indigo-600 border-indigo-400" />
              <Label htmlFor="words-300" className="cursor-pointer w-full">
                <span className="font-medium">300 words</span>
                <span className="text-sm text-indigo-600 ml-2">(Brief)</span>
              </Label>
            </div>
            <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-indigo-50 transition-colors">
              <RadioGroupItem value="500" id="words-500" className="text-indigo-600 border-indigo-400" />
              <Label htmlFor="words-500" className="cursor-pointer w-full">
                <span className="font-medium">500 words</span>
                <span className="text-sm text-indigo-600 ml-2">(Standard)</span>
              </Label>
            </div>
            <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-indigo-50 transition-colors">
              <RadioGroupItem value="700" id="words-700" className="text-indigo-600 border-indigo-400" />
              <Label htmlFor="words-700" className="cursor-pointer w-full">
                <span className="font-medium">700 words</span>
                <span className="text-sm text-indigo-600 ml-2">(Detailed)</span>
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2 mb-2 text-indigo-800">
            <MessageSquare className="h-4 w-4" />
            <Label className="font-medium">Writing Style</Label>
          </div>
          <RadioGroup
            value={preferences.fluency}
            onValueChange={(value) =>
              onPreferencesChange({ ...preferences, fluency: value as "basic" | "standard" | "professional" })
            }
            className="flex flex-col space-y-2"
          >
            <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-indigo-50 transition-colors">
              <RadioGroupItem value="basic" id="fluency-basic" className="text-indigo-600 border-indigo-400" />
              <Label htmlFor="fluency-basic" className="cursor-pointer w-full">
                <span className="font-medium">Basic</span>
                <span className="text-sm text-indigo-600 ml-2">(Simple and clear)</span>
              </Label>
            </div>
            <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-indigo-50 transition-colors">
              <RadioGroupItem value="standard" id="fluency-standard" className="text-indigo-600 border-indigo-400" />
              <Label htmlFor="fluency-standard" className="cursor-pointer w-full">
                <span className="font-medium">Standard</span>
                <span className="text-sm text-indigo-600 ml-2">(Balanced)</span>
              </Label>
            </div>
            <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-indigo-50 transition-colors">
              <RadioGroupItem value="professional" id="fluency-professional" className="text-indigo-600 border-indigo-400" />
              <Label htmlFor="fluency-professional" className="cursor-pointer w-full">
                <span className="font-medium">Professional</span>
                <span className="text-sm text-indigo-600 ml-2">(Academic style)</span>
              </Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
};

export default SummaryPreferences;
