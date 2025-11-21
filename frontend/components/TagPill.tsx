import Link from "next/link";
import { Tag } from "@/lib/api";
import { cn } from "@/lib/utils";

interface TagPillProps {
  tag: Tag;
  size?: "sm" | "md" | "lg";
}

export function TagPill({ tag, size = "md" }: TagPillProps) {
  const sizeClasses = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-3 py-1.5",
    lg: "text-base px-4 py-2",
  };

  return (
    <Link
      href={`/tags/${tag.slug}`}
      className={cn(
        "inline-block bg-primary-100 text-primary-800 rounded-full font-medium hover:bg-primary-200 transition-colors",
        sizeClasses[size]
      )}
    >
      {tag.name}
    </Link>
  );
}
