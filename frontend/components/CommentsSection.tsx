"use client";

import { useState } from "react";
import { Comment, createComment } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

interface CommentsSectionProps {
  petId: string;
  comments: Comment[];
}

export function CommentsSection({
  petId,
  comments: initialComments,
}: CommentsSectionProps) {
  const [comments, setComments] = useState(initialComments);
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isAuthenticated } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !isAuthenticated) return;

    setIsSubmitting(true);
    try {
      const newComment = await createComment(petId, content);
      setComments([newComment, ...comments]);
      setContent("");
    } catch (error) {
      console.error("Failed to create comment:", error);
      alert("Failed to post comment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mt-12 border-t pt-8">
      <h2 className="text-2xl font-semibold mb-6">Comments</h2>

      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write a comment..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 mb-4"
            rows={4}
            required
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Posting..." : "Post Comment"}
          </button>
        </form>
      ) : (
        <p className="text-gray-600 mb-8">Please log in to post a comment.</p>
      )}

      <div className="space-y-6">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold">
                  {comment.user.name || comment.user.email}
                </span>
                <span className="text-sm text-gray-500">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-700 whitespace-pre-line">
                {comment.content}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-600">
            No comments yet. Be the first to comment!
          </p>
        )}
      </div>
    </section>
  );
}
