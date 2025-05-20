import { Metadata } from "next";
import { EnhancedChatInterface } from "@/components/chat/EnhancedChatInterface";

export const metadata: Metadata = {
  title: "Ask Clara | Election Awareness Portal",
  description: "Ask questions about candidates, issues, and policies to find information that matches your interests.",
};

export default function AskPage() {
  return (
    <div className="container py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Ask Clara</h1>
          <p className="text-lg text-muted-foreground mt-2">
            Ask questions about candidates, policies, or issues to get personalized information and discover candidates who align with your views.
          </p>
        </div>
        
        <EnhancedChatInterface />
        
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Sample Questions</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="font-medium">Policy Questions</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li>"What do candidates think about healthcare reform?"</li>
                <li>"Who supports renewable energy policies?"</li>
                <li>"Which candidates prioritize education funding?"</li>
              </ul>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="font-medium">Candidate Questions</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li>"Tell me about Alex Johnson's economic policies"</li>
                <li>"What is Morgan Smith's stance on immigration?"</li>
                <li>"Which candidates have experience in healthcare?"</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 