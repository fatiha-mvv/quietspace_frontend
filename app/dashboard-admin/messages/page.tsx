"use client";

import { useEffect, useState } from "react";
import feedbackService, { FeedbackData } from "../../../services/feedback";

export default function AdminMessagesPage() {
  const [feedbacks, setFeedbacks] = useState<FeedbackData[]>([]);
  const [filtered, setFiltered] = useState<FeedbackData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filterDate, setFilterDate] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const data = await feedbackService.findAll();
        setFeedbacks(data);
        setFiltered(data);
      } catch (err: any) {
        console.error(err);
        setError("Failed to load feedbacks.");
      } finally {
        setLoading(false);
      }
    };
    fetchFeedbacks();
  }, []);

  useEffect(() => {
    let temp = [...feedbacks];

    // Filter by selected date
    if (filterDate) {
      const selected = new Date(filterDate);
      temp = temp.filter((fb) => {
        if (!fb.createdAt) return false;
        const fbDate = new Date(fb.createdAt);
        return (
          fbDate.getFullYear() === selected.getFullYear() &&
          fbDate.getMonth() === selected.getMonth() &&
          fbDate.getDate() === selected.getDate()
        );
      });
    }

    // Sort
    temp.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    setFiltered(temp);
  }, [filterDate, sortOrder, feedbacks]);

  const handleDelete = async (id?: number) => {
    if (!id) return;
    const confirm = window.confirm(
      "Are you sure you want to delete this feedback?",
    );
    if (!confirm) return;

    try {
      await feedbackService.delete(id);
      setFeedbacks(feedbacks.filter((fb) => fb.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete feedback.");
    }
  };

  if (loading) return <p className="py-10 text-center">Loading feedbacks...</p>;
  if (error) return <p className="py-10 text-center text-red-500">{error}</p>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Feedbacks</h2>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap items-center gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Filter by Date
          </label>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="mt-1 rounded-md border-gray-300 px-3 py-2 text-sm dark:bg-gray-700 dark:text-gray-200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Sort By
          </label>
          <select
            value={sortOrder}
            onChange={(e) =>
              setSortOrder(e.target.value as "newest" | "oldest")
            }
            className="mt-1 rounded-md border-gray-300 px-3 py-2 text-sm dark:bg-gray-700 dark:text-gray-200"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Feedbacks */}
      {filtered.length === 0 ? (
        <p className="text-gray-500">No feedbacks found.</p>
      ) : (
        <div className="space-y-4">
          {filtered.map((fb) => (
            <div
              key={fb.id}
              className="rounded-lg border border-gray-200 bg-white p-4 shadow-md dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="mb-2 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-800 dark:text-gray-200">
                    {fb.userId ? `User #${fb.userId}` : fb.name || "Anonymous"}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {fb.email || "-"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {fb.createdAt
                      ? new Date(fb.createdAt).toLocaleString()
                      : "-"}
                  </span>
                  {/* Delete button */}
                  <button
                    onClick={() => handleDelete(fb.id)}
                    className="ml-2 rounded bg-red-500 px-2 py-1 text-xs font-semibold text-white hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300">{fb.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// export default function AdminMessagesPage() {
//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <h2 className="text-xl font-semibold text-gray-900">Feedbacks</h2>
//       </div>
//       <div className="bg-white rounded-xl border border-gray-200 p-6">
//         <p className="text-gray-500">Liste des Feedbacks à implémenter...</p>
//       </div>
//     </div>
//   );
// }
