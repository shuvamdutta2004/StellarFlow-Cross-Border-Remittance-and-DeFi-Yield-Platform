"use client";

import React, { useState } from "react";
import { INITIAL_USER_FEEDBACK, UserFeedback, logAnalyticsEvent } from "@/lib/analytics";
import { useWalletStore } from "@/store/walletStore";
import { MessageSquare, Star, Send, ShieldCheck, User } from "lucide-react";
import { toast } from "sonner";

export default function UserFeedbackModal() {
  const { address } = useWalletStore();
  const [feedbackList, setFeedbackList] = useState<UserFeedback[]>(INITIAL_USER_FEEDBACK);
  const [rating, setRating] = useState<number>(5);
  const [category, setCategory] = useState<UserFeedback["category"]>("usability");
  const [comment, setComment] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error("Please enter a brief feedback comment");
      return;
    }

    setIsSubmitting(true);
    await new Promise((res) => setTimeout(res, 600));

    const newFeedback: UserFeedback = {
      id: `fb_${Date.now()}`,
      walletAddress: address || "GDSFFHT4YTWUFV4GI7KROZPPLN5LEEJPUR24HTO4BDJPGZVPV3PPKIOG",
      rating,
      category,
      comment,
      createdAt: new Date().toISOString().replace("T", " ").substring(0, 19),
    };

    setFeedbackList([newFeedback, ...feedbackList]);
    logAnalyticsEvent("user_feedback_submitted", address || undefined, { rating, category });

    toast.success("Thank you! Your feedback has been recorded for product validation.");
    setComment("");
    setIsSubmitting(false);
  };

  return (
    <div className="glass-panel rounded-2xl p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Product Feedback & Validation</h3>
            <p className="text-xs text-zinc-400">Level 4 Requirement: Real-world user feedback collection</p>
          </div>
        </div>
      </div>

      {/* Submission Form */}
      <form onSubmit={handleSubmit} className="bg-secondary/60 border border-white/10 p-5 rounded-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-300">Rating</label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-5 h-5 ${
                      star <= rating ? "fill-amber-400 text-amber-400" : "text-zinc-600"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-300">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="bg-secondary border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
            >
              <option value="usability">UX & Ease of Use</option>
              <option value="speed">Transaction Speed</option>
              <option value="fees">Fee Cost Savings</option>
              <option value="general">General Suggestion</option>
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-zinc-300">Your Feedback</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience using StellarFlow remittances..."
            rows={2}
            className="w-full bg-secondary border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium text-xs py-2.5 rounded-xl shadow-md hover:opacity-90 transition-opacity"
        >
          <Send className="w-3.5 h-3.5" />
          {isSubmitting ? "Submitting..." : "Submit User Feedback"}
        </button>
      </form>

      {/* List of Feedback Submissions */}
      <div className="space-y-3 pt-2">
        <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider font-mono">
          Collected Feedback Reports ({feedbackList.length})
        </h4>

        <div className="space-y-3">
          {feedbackList.map((item) => (
            <div key={item.id} className="bg-secondary/40 border border-white/5 p-4 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-zinc-400" />
                  <span className="font-mono text-zinc-300">
                    {(item.walletAddress || "GDSFFHT4YTWUFV4GI7KROZPPLN5LEEJPUR24HTO4BDJPGZVPV3PPKIOG").slice(0, 6)}...{(item.walletAddress || "GDSFFHT4YTWUFV4GI7KROZPPLN5LEEJPUR24HTO4BDJPGZVPV3PPKIOG").slice(-4)}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>

              <p className="text-xs text-zinc-200 italic">&quot;{item.comment}&quot;</p>

              <div className="flex justify-between items-center text-[10px] text-zinc-400 pt-1 border-t border-white/5">
                <span className="capitalize text-cyan-300">Category: {item.category}</span>
                <span>{item.createdAt}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
