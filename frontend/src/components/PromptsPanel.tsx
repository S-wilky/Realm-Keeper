import React, { useState } from "react";
import {
  MessageSquarePlus,
  MessageSquareDashed,
  Check,
  Plus,
  Info,
  ChevronRight,
} from "lucide-react";
import "../styles/overrides.css";

export interface Prompt {
  id: string;
  text: string;
  isUsed?: boolean;
}

interface PromptsPanelProps {
  tomeType?: string;
  initialPrompts?: Prompt[];
  onPromptClick?: (prompt: Prompt) => void;
  onAddPrompt?: (text: string, isDefault: boolean) => void;
  className?: string;
}

const DEFAULT_PROMPTS: Prompt[] = [
  { id: "1", text: "What do they want?", isUsed: true },
  { id: "2", text: "Who founded it, and why?", isUsed: true },
  { id: "3", text: "Where do they gather?", isUsed: false },
  { id: "4", text: "Who opposes them?", isUsed: false },
  { id: "5", text: "What do outsiders get wrong?", isUsed: false },
];

type ViewState = "list" | "empty" | "add";

export default function PromptsPanel({
  tomeType = "Organization",
  initialPrompts = DEFAULT_PROMPTS,
  onPromptClick,
  onAddPrompt,
  className = "",
}: PromptsPanelProps) {
  const [activeTab, setActiveTab] = useState<"prompts" | "sections">("prompts");
  const [prompts, setPrompts] = useState<Prompt[]>(initialPrompts);
  const [viewState, setViewState] = useState<ViewState>(
    initialPrompts.length > 0 ? "list" : "empty"
  );

  // Add View Form State
  const [newPromptText, setNewPromptText] = useState("");
  const [makeDefault, setMakeDefault] = useState(false);

  const usedCount = prompts.filter((p) => p.isUsed).length;

  const handlePromptClick = (prompt: Prompt) => {
    // Toggle the isUsed state instead of forcing it to true
    const updatedStatus = !prompt.isUsed;
    
    setPrompts((prev) =>
      prev.map((p) => (p.id === prompt.id ? { ...p, isUsed: updatedStatus } : p))
    );
    
    // Pass the newly updated prompt data back to the parent
    onPromptClick?.({ ...prompt, isUsed: updatedStatus });
  };

  const handleAddSubmit = () => {
    if (!newPromptText.trim()) return;
    
    const newPrompt: Prompt = {
      id: Date.now().toString(),
      text: newPromptText.trim(),
      isUsed: false,
    };

    onAddPrompt?.(newPrompt.text, makeDefault);
    setPrompts((prev) => [...prev, newPrompt]);
    setNewPromptText("");
    setMakeDefault(false);
    setViewState("list");
  };

  return (
    <div
      className={`flex flex-col bg-[#0B1320] border border-[#1E2D4A] rounded-xl overflow-hidden w-full max-w-[320px] text-sm ${className}`}
    >
      {/* Header Area */}
      <div className="flex items-center justify-between p-3 border-b border-[#1E2D4A]/50 bg-[#0B1320]">
        <div className="flex items-center gap-3">
          <MessageSquarePlus className="w-5 h-5 text-[#94A3B8] shrink-0" />
          
          {/* Tab Pill */}
          <div className="flex bg-[#121C2E] p-0.5 rounded-lg border border-[#1E2D4A]">
            <button
              onClick={() => setActiveTab("prompts")}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                activeTab === "prompts"
                  ? "bg-[#2563EB] text-white shadow-sm"
                  : "text-[#94A3B8] hover:text-[#ECE6DA]"
              }`}
            >
              Prompts
            </button>
            <button
              onClick={() => setActiveTab("sections")}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                activeTab === "sections"
                  ? "bg-[#2563EB] text-white shadow-sm"
                  : "text-[#94A3B8] hover:text-[#ECE6DA]"
              }`}
            >
              Sections
            </button>
          </div>
        </div>

        {/* Right Label */}
        <button className="flex items-center gap-1 text-[#94A3B8] hover:text-[#ECE6DA] transition-colors text-xs font-medium">
          {tomeType} <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Dynamic Content Body */}
      <div className="flex flex-col p-4">
        
        {/* VIEW: Populated List */}
        {viewState === "list" && (
          <div className="flex flex-col gap-2">
            {prompts.map((prompt) => (
              <button
                key={prompt.id}
                onClick={() => handlePromptClick(prompt)}
                className={`flex items-start w-full px-3 py-2 text-left rounded-lg border transition-all cursor-pointer ${
                  prompt.isUsed
                    ? "border-[#1E2D4A] bg-[#121C2E] text-[#94A3B8]"
                    : "border-[#2A3A55] bg-[#0B1320] text-[#ECE6DA] hover:border-[#3B82F6]"
                }`}
              >
                {prompt.isUsed && (
                  <Check className="w-4 h-4 text-emerald-500 mr-2 mt-0.5 shrink-0" />
                )}
                <span className="leading-tight">{prompt.text}</span>
              </button>
            ))}

            {/* Custom Button */}
            <button
              onClick={() => setViewState("add")}
              className="flex items-center gap-2 px-3 py-2 text-[#FF7A2F] border border-[#FF7A2F]/40 hover:border-[#FF7A2F] bg-[#FF7A2F]/5 hover:bg-[#FF7A2F]/10 rounded-lg transition-colors font-medium mt-1 w-fit cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Custom
            </button>

            {/* Footer Info */}
            <div className="flex gap-2 mt-4 pt-4 border-t border-[#1E2D4A]/50 text-[#94A3B8] text-xs">
              <Info className="w-4 h-4 shrink-0" />
              <p className="leading-snug">
                Click a prompt to drop it in as a heading. <br />
                {usedCount} used.
              </p>
            </div>
          </div>
        )}

        {/* VIEW: Empty State */}
        {viewState === "empty" && (
          <div className="flex flex-col items-center text-center py-6 gap-3">
            <MessageSquareDashed className="w-8 h-8 text-[#475569] mb-1" />
            <h3 className="font-semibold text-[#ECE6DA]">No prompts for this type</h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed max-w-[240px]">
              Notes are freeform, so there is nothing to suggest. Add your own if you want a structure to return to.
            </p>
            <button
              onClick={() => setViewState("add")}
              className="mt-2 flex items-center gap-2 px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg transition-colors font-medium text-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add a prompt
            </button>
          </div>
        )}

        {/* VIEW: Add New Prompt */}
        {viewState === "add" && (
          <div className="flex flex-col gap-4 animate-fadeIn">
            {/* Input Group */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-[#94A3B8]">Prompt</label>
              <input
                type="text"
                value={newPromptText}
                onChange={(e) => setNewPromptText(e.target.value)}
                placeholder="Enter prompt here..."
                autoFocus
                className="w-full bg-[#121C2E] border border-[#2A3A55] rounded-lg px-3 py-2.5 text-[#ECE6DA] placeholder-[#475569] focus:outline-none focus:border-[#3B82F6] transition-colors text-sm"
              />
            </div>

            {/* Toggle Group */}
            <div className="flex items-center justify-between p-3 bg-[#121C2E]/50 border border-[#1E2D4A] rounded-lg">
              <div className="flex flex-col gap-0.5 pr-4">
                <span className="text-sm font-medium text-[#ECE6DA]">
                  Make default for this {tomeType.toLowerCase()} type
                </span>
                <span className="text-[11px] text-[#94A3B8] leading-tight">
                  Will become an option on all future tomes of this type
                </span>
              </div>
              
              {/* Custom CSS Toggle */}
              <button
                onClick={() => setMakeDefault(!makeDefault)}
                className={`w-10 h-5 shrink-0 rounded-full p-0.5 transition-colors duration-200 ease-in-out cursor-pointer border ${
                  makeDefault 
                    ? "bg-[#2563EB] border-[#2563EB]" 
                    : "bg-[#0B1320] border-[#2A3A55]"
                }`}
              >
                <div
                  className={`w-3.5 h-3.5 bg-white rounded-full shadow-sm transition-transform duration-200 ease-in-out ${
                    makeDefault ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={handleAddSubmit}
                disabled={!newPromptText.trim()}
                className="flex-1 bg-[#2563EB] hover:bg-[#1D4ED8] disabled:bg-[#1E2D4A] disabled:text-[#475569] text-white rounded-lg px-4 py-2 font-medium transition-colors text-sm cursor-pointer"
              >
                Add prompt
              </button>
              <button
                onClick={() => setViewState(prompts.length > 0 ? "list" : "empty")}
                className="px-4 py-2 bg-transparent hover:bg-[#1E2D4A] text-[#94A3B8] hover:text-[#ECE6DA] rounded-lg transition-colors font-medium text-sm border border-transparent cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}