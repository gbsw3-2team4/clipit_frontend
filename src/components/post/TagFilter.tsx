import { useState } from "react";

const tags = ["전체", "프론트엔드", "백엔드", "AI", "SQL/DB", "클라우드"];

const TagFilter = () => {
  const [selectedTag, setSelectedTag] = useState("전체");

  return (
    <div className="w-full h-8 flex flex-wrap gap-4 my-10">
      {tags.map((tag) => {
        const isSelected = selectedTag === tag;

        return (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={`h-full px-3 text-sm rounded-full transition cursor-pointer
              ${
                isSelected
                  ? "bg-black text-[var(--bg-sub-color)]"
                  : "bg-[var(--bg-sub-color)] text-[var(--text-color)] hover:bg-gray-100"
              }
            `}
          >
            {tag}
          </button>
        );
      })}
    </div>
  );
};

export default TagFilter;
