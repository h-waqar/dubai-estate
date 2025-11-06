// =============================================================================
// FILE: src/modules/media/components/MediaLibraryTabs.tsx
// =============================================================================
"use client";

interface MediaLibraryTabsProps {
  activeTab: "library" | "upload";
  onTabChange: (tab: "library" | "upload") => void;
}

export default function MediaLibraryTabs({
  activeTab,
  onTabChange,
}: MediaLibraryTabsProps) {
  return (
    <div className="flex border-b border-gray-200 dark:border-gray-800 px-6">
      <button
        onClick={() => onTabChange("library")}
        className={`px-4 py-3 font-medium transition-colors border-b-2 ${
          activeTab === "library"
            ? "border-blue-500 text-blue-600 dark:text-blue-400"
            : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
        }`}
      >
        Library
      </button>
      <button
        onClick={() => onTabChange("upload")}
        className={`px-4 py-3 font-medium transition-colors border-b-2 ${
          activeTab === "upload"
            ? "border-blue-500 text-blue-600 dark:text-blue-400"
            : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
        }`}
      >
        Upload
      </button>
    </div>
  );
}
