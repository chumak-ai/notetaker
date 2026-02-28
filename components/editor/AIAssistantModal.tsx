"use client";

import { useState } from "react";
import {
  XIcon,
  SparklesIcon,
  WandIcon,
  FileTextIcon,
  TagIcon,
  ListChecksIcon,
  PenToolIcon,
} from "lucide-react";

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedText: string;
  onApply: (result: string) => void;
  fullText: string;
}

export default function AIAssistantModal({
  isOpen,
  onClose,
  selectedText,
  onApply,
  fullText,
}: AIAssistantModalProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [activeTab, setActiveTab] = useState<"improve" | "analyze">("improve");

  if (!isOpen) return null;

  const improveText = async (action: string) => {
    setLoading(true);
    try {
      const response = await fetch("/api/ai/improve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: selectedText || fullText,
          action,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setResult(data.result);
      }
    } catch (error) {
      console.error("AI improve error:", error);
    } finally {
      setLoading(false);
    }
  };

  const summarize = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/ai/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: selectedText || fullText,
          type: "summary",
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setResult(data.result);
      }
    } catch (error) {
      console.error("AI summarize error:", error);
    } finally {
      setLoading(false);
    }
  };

  const extractKeyPoints = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/ai/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: selectedText || fullText,
          type: "keypoints",
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setResult(Array.isArray(data.result) ? data.result.join("\n• ") : data.result);
      }
    } catch (error) {
      console.error("AI key points error:", error);
    } finally {
      setLoading(false);
    }
  };

  const suggestTags = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/ai/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: selectedText || fullText,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setResult(data.tags.join(", "));
      }
    } catch (error) {
      console.error("AI tags error:", error);
    } finally {
      setLoading(false);
    }
  };

  const extractActions = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/ai/actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: selectedText || fullText,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setResult(data.actions.map((action: string, i: number) => `${i + 1}. ${action}`).join("\n"));
      }
    } catch (error) {
      console.error("AI actions error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <SparklesIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                AI Assistant
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {selectedText ? "Working with selected text" : "Working with full note"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <XIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab("improve")}
            className={`flex-1 px-6 py-3 font-medium transition-colors ${
              activeTab === "improve"
                ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            <WandIcon className="w-4 h-4 inline mr-2" />
            Improve Text
          </button>
          <button
            onClick={() => setActiveTab("analyze")}
            className={`flex-1 px-6 py-3 font-medium transition-colors ${
              activeTab === "analyze"
                ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            <FileTextIcon className="w-4 h-4 inline mr-2" />
            Analyze
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "improve" && (
            <div className="space-y-3">
              <button
                onClick={() => improveText("improve")}
                disabled={loading}
                className="w-full p-4 text-left border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors disabled:opacity-50"
              >
                <div className="font-medium text-gray-900 dark:text-white mb-1">
                  Fix Grammar & Spelling
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Correct errors and improve clarity
                </div>
              </button>
              <button
                onClick={() => improveText("formal")}
                disabled={loading}
                className="w-full p-4 text-left border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors disabled:opacity-50"
              >
                <div className="font-medium text-gray-900 dark:text-white mb-1">
                  Make Formal
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Rewrite in a formal tone
                </div>
              </button>
              <button
                onClick={() => improveText("casual")}
                disabled={loading}
                className="w-full p-4 text-left border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors disabled:opacity-50"
              >
                <div className="font-medium text-gray-900 dark:text-white mb-1">
                  Make Casual
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Rewrite in a friendly, casual tone
                </div>
              </button>
              <button
                onClick={() => improveText("expand")}
                disabled={loading}
                className="w-full p-4 text-left border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors disabled:opacity-50"
              >
                <div className="font-medium text-gray-900 dark:text-white mb-1">
                  Expand
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Add more detail and context
                </div>
              </button>
              <button
                onClick={() => improveText("shorten")}
                disabled={loading}
                className="w-full p-4 text-left border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors disabled:opacity-50"
              >
                <div className="font-medium text-gray-900 dark:text-white mb-1">
                  Shorten
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Make more concise
                </div>
              </button>
            </div>
          )}

          {activeTab === "analyze" && (
            <div className="space-y-3">
              <button
                onClick={summarize}
                disabled={loading}
                className="w-full p-4 text-left border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors disabled:opacity-50"
              >
                <div className="font-medium text-gray-900 dark:text-white mb-1">
                  <FileTextIcon className="w-4 h-4 inline mr-2" />
                  Summarize
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Get a brief summary of the content
                </div>
              </button>
              <button
                onClick={extractKeyPoints}
                disabled={loading}
                className="w-full p-4 text-left border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors disabled:opacity-50"
              >
                <div className="font-medium text-gray-900 dark:text-white mb-1">
                  <ListChecksIcon className="w-4 h-4 inline mr-2" />
                  Extract Key Points
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Get the main points as a list
                </div>
              </button>
              <button
                onClick={suggestTags}
                disabled={loading}
                className="w-full p-4 text-left border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors disabled:opacity-50"
              >
                <div className="font-medium text-gray-900 dark:text-white mb-1">
                  <TagIcon className="w-4 h-4 inline mr-2" />
                  Suggest Tags
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Get relevant tags for organization
                </div>
              </button>
              <button
                onClick={extractActions}
                disabled={loading}
                className="w-full p-4 text-left border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors disabled:opacity-50"
              >
                <div className="font-medium text-gray-900 dark:text-white mb-1">
                  <PenToolIcon className="w-4 h-4 inline mr-2" />
                  Extract Action Items
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Find tasks and to-dos
                </div>
              </button>
            </div>
          )}

          {/* Result */}
          {result && (
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">
                Result:
              </div>
              <div className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">
                {result}
              </div>
            </div>
          )}

          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          )}
        </div>

        {/* Footer */}
        {result && (
          <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex gap-3">
            <button
              onClick={() => setResult("")}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300 font-medium"
            >
              Try Again
            </button>
            <button
              onClick={() => {
                onApply(result);
                onClose();
                setResult("");
              }}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
            >
              Apply to Note
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
