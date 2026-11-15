import React, { useState } from "react";
import { Link2, ChevronDown, ChevronUp, Check, X, Search } from "lucide-react";
import "../styles/overrides.css";

export interface MatchContext {
  id: string;
  preText: string;
  matchText: string;
  postText: string;
}

export interface LinkSuggestion {
  id: string;
  title: string;
  typeInfo: string;
  matches: MatchContext[];
  status: "pending" | "dismissed" | "accepted";
}

const INITIAL_SUGGESTIONS: LinkSuggestion[] = [
  {
    id: "s1",
    title: "Kestrel Hollow",
    typeInfo: "Location · 3 matches",
    status: "pending",
    matches: [
      { id: "m1", preText: "Sworn in the ruin of", matchText: "Kestrel Hollow", postText: ", the Compact..." },
      { id: "m2", preText: "", matchText: "Kestrel Hollow", postText: "Sworn in the ruin of, the Compact..." },
      { id: "m3", preText: "Sworn in the ruin of, the Compact...", matchText: "Kestrel Hollow", postText: "" },
    ],
  },
  {
    id: "s2",
    title: "Emberwardens",
    typeInfo: "Organization · 2 matches",
    status: "pending",
    matches: [
      { id: "m4", preText: "...answers only to the", matchText: "Emberwardens", postText: ". Their charter..." },
    ],
  },
  {
    id: "s3",
    title: "Maren Voss",
    typeInfo: 'Character · alias "Maren"',
    status: "pending",
    matches: [
      { id: "m5", preText: "...a forgery.", matchText: "Maren", postText: "knows, and has..." },
    ],
  },
  {
    id: "s4",
    title: "The Ashen Oath",
    typeInfo: 'Item · alias "the Oath"',
    status: "dismissed",
    matches: [
      { id: "m6", preText: "...what would break", matchText: "the Oath", postText: "?" },
    ],
  },
];

export default function AutolinkerPanel() {
  const [isMainExpanded, setIsMainExpanded] = useState(true);
  const [isDismissedExpanded, setIsDismissedExpanded] = useState(true);
  const [suggestions, setSuggestions] = useState<LinkSuggestion[]>(INITIAL_SUGGESTIONS);

  const pendingSuggestions = suggestions.filter((s) => s.status === "pending");
  const dismissedSuggestions = suggestions.filter((s) => s.status === "dismissed");
  const pendingCount = pendingSuggestions.reduce((acc, curr) => acc + curr.matches.length, 0);

  const setStatus = (id: string, status: "pending" | "dismissed" | "accepted") => {
    setSuggestions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status } : s))
    );
  };

  const handleAcceptAll = () => {
    setSuggestions((prev) =>
      prev.map((s) => (s.status === "pending" ? { ...s, status: "accepted" } : s))
    );
  };

  const handleDismissAll = () => {
    setSuggestions((prev) =>
      prev.map((s) => (s.status === "pending" ? { ...s, status: "dismissed" } : s))
    );
  };

  const handleAcceptFirstOfAll = () => {
    // In a real app, this would accept only the first match instance of each pending entity.
    // For UI demonstration, we'll mark them accepted.
    handleAcceptAll();
  };

  return (
    <div className="flex flex-col bg-[#0B1320] border border-[#1E2D4A] rounded-xl overflow-hidden w-full max-w-[320px] text-sm select-none">
      {/* Header */}
      <button
        onClick={() => setIsMainExpanded(!isMainExpanded)}
        className="flex items-center justify-between p-3 border-b border-[#1E2D4A]/50 bg-[#0B1320] hover:bg-[#121C2E]/50 transition-colors w-full text-left"
      >
        <div className="flex items-center gap-2">
          <Link2 className="w-4 h-4 text-[#94A3B8] shrink-0" />
          <span className="font-semibold text-[#ECE6DA]">Suggested links</span>
          {pendingCount > 0 && (
            <span className="bg-[#FF7A2F] text-white text-[11px] font-bold px-1.5 py-0.5 rounded-full leading-none">
              {pendingCount}
            </span>
          )}
        </div>
        <ChevronDown
          className={`w-4 h-4 text-[#94A3B8] transition-transform duration-200 ${
            isMainExpanded ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Main Body */}
      {isMainExpanded && (
        <div className="flex flex-col">
          {/* Global Actions */}
          <div className="flex items-center justify-between p-3 gap-2 border-b border-[#1E2D4A]/30">
            <button
              onClick={handleAcceptAll}
              disabled={pendingSuggestions.length === 0}
              className="flex-1 bg-[#121C2E] border border-[#1E2D4A] text-[#3B82F6] hover:bg-[#1E2D4A] hover:border-[#3B82F6]/50 disabled:opacity-50 disabled:hover:bg-[#121C2E] disabled:hover:border-[#1E2D4A] rounded-lg py-1.5 text-xs font-medium transition-all"
            >
              Accept all
            </button>
            <button
              onClick={handleDismissAll}
              disabled={pendingSuggestions.length === 0}
              className="flex-1 bg-[#121C2E] border border-[#1E2D4A] text-[#EF4444] hover:bg-[#1E2D4A] hover:border-[#EF4444]/50 disabled:opacity-50 disabled:hover:bg-[#121C2E] disabled:hover:border-[#1E2D4A] rounded-lg py-1.5 text-xs font-medium transition-all"
            >
              Dismiss All
            </button>
            <button
              onClick={handleAcceptFirstOfAll}
              disabled={pendingSuggestions.length === 0}
              className="flex-1 bg-[#121C2E] border border-[#1E2D4A] text-[#3B82F6] hover:bg-[#1E2D4A] hover:border-[#3B82F6]/50 disabled:opacity-50 disabled:hover:bg-[#121C2E] disabled:hover:border-[#1E2D4A] rounded-lg py-1.5 text-xs font-medium transition-all"
            >
              Accept First of All
            </button>
          </div>

          {/* Pending Suggestions List */}
          <div className="flex flex-col">
            {pendingSuggestions.length === 0 ? (
              <div className="p-4 text-center text-[#94A3B8] text-xs">No pending suggestions.</div>
            ) : (
              pendingSuggestions.map((suggestion) => (
                <div key={suggestion.id} className="flex flex-col p-3 border-b border-[#1E2D4A]/30">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex gap-2">
                      <Link2 className="w-4 h-4 text-[#A855F7] shrink-0 mt-0.5" />
                      <div className="flex flex-col">
                        <span className="text-[#ECE6DA] font-medium leading-tight">
                          {suggestion.title}
                        </span>
                        <span className="text-[#475569] text-[11px] leading-tight mt-0.5">
                          {suggestion.typeInfo}
                        </span>
                      </div>
                    </div>
                    {/* Item Actions */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => setStatus(suggestion.id, "accepted")}
                        title="Accept"
                        className="p-1 rounded-md border border-[#22C55E]/30 text-[#22C55E] hover:bg-[#22C55E]/10 transition-colors"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setStatus(suggestion.id, "dismissed")}
                        title="Dismiss"
                        className="p-1 rounded-md border border-[#EF4444]/30 text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                      <button
                        title="Find"
                        className="p-1 rounded-md border border-[#3B82F6]/30 text-[#3B82F6] hover:bg-[#3B82F6]/10 transition-colors"
                      >
                        <Search className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Context Snippets */}
                  <ul className="text-xs text-[#94A3B8] space-y-1.5 pl-4 list-disc marker:text-[#475569]">
                    {suggestion.matches.map((match) => (
                      <li key={match.id} className="pl-1 leading-relaxed">
                        {match.preText}
                        <span className="bg-[#3B2856] text-[#D8B4FE] px-1 rounded-sm mx-0.5">
                          {match.matchText}
                        </span>
                        {match.postText}
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Dismissed Suggestions Accordion */}
      {dismissedSuggestions.length > 0 && (
        <div className="flex flex-col border-t border-[#1E2D4A] bg-[#121C2E]/30">
          <button
            onClick={() => setIsDismissedExpanded(!isDismissedExpanded)}
            className="flex items-center justify-between p-3 hover:bg-[#121C2E]/80 transition-colors w-full text-left"
          >
            <span className="font-medium text-[#94A3B8] text-xs">Dismissed Suggestions</span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-[#94A3B8] transition-transform duration-200 ${
                isDismissedExpanded ? "rotate-180" : ""
              }`}
            />
          </button>

          {isDismissedExpanded && (
            <div className="flex flex-col">
              {dismissedSuggestions.map((suggestion) => (
                <div key={suggestion.id} className="flex flex-col p-3 border-t border-[#1E2D4A]/30">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex gap-2 opacity-60">
                      <Link2 className="w-4 h-4 text-[#A855F7] shrink-0 mt-0.5" />
                      <div className="flex flex-col">
                        <span className="text-[#ECE6DA] font-medium leading-tight line-through decoration-[#475569]">
                          {suggestion.title}
                        </span>
                        <span className="text-[#475569] text-[11px] leading-tight mt-0.5">
                          {suggestion.typeInfo}
                        </span>
                      </div>
                    </div>
                    {/* Dismissed Item Actions */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => setStatus(suggestion.id, "pending")}
                        title="Restore"
                        className="p-1 rounded-md border border-[#22C55E]/30 text-[#22C55E] hover:bg-[#22C55E]/10 transition-colors"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        title="Find"
                        className="p-1 rounded-md border border-[#3B82F6]/30 text-[#3B82F6] hover:bg-[#3B82F6]/10 transition-colors"
                      >
                        <Search className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Context Snippets */}
                  <ul className="text-xs text-[#64748B] space-y-1.5 pl-4 list-disc marker:text-[#475569]">
                    {suggestion.matches.map((match) => (
                      <li key={match.id} className="pl-1 leading-relaxed">
                        {match.preText}
                        <span className="bg-[#3B2856]/50 text-[#D8B4FE]/70 px-1 rounded-sm mx-0.5 line-through decoration-[#475569]">
                          {match.matchText}
                        </span>,
                        {match.postText}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}