import { randomUUID } from "crypto";
import { isSupabaseConfigured, getSupabaseServerClient } from "./supabase";
import { readLocal, writeLocal } from "./localFile";
import type { Review } from "../types";

const FILE = "reviews.json";

export async function listPublishedReviews(limit = 20): Promise<Review[]> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) throw new Error(`Database error: ${error.message}`);
    return data as Review[];
  }

  const rows = readLocal<Review>(FILE);
  return rows
    .filter((r) => r.published)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, limit);
}

export async function listAllReviews(): Promise<Review[]> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(`Database error: ${error.message}`);
    return data as Review[];
  }

  const rows = readLocal<Review>(FILE);
  return [...rows].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export async function createReview(
  input: Omit<Review, "id" | "created_at" | "published">
): Promise<Review> {
  const row: Review = {
    id: randomUUID(),
    created_at: new Date().toISOString(),
    published: false, // an admin must approve every review before it goes live
    ...input
  };

  if (isSupabaseConfigured()) {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase.from("reviews").insert(row).select().single();
    if (error) throw new Error(`Database error: ${error.message}`);
    return data as Review;
  }

  const rows = readLocal<Review>(FILE);
  rows.push(row);
  writeLocal(FILE, rows);
  return row;
}

export async function setReviewPublished(id: string, published: boolean): Promise<Review | null> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("reviews")
      .update({ published })
      .eq("id", id)
      .select()
      .maybeSingle();
    if (error) throw new Error(`Database error: ${error.message}`);
    return (data as Review) ?? null;
  }

  const rows = readLocal<Review>(FILE);
  const idx = rows.findIndex((r) => r.id === id);
  if (idx === -1) return null;
  rows[idx] = { ...rows[idx], published };
  writeLocal(FILE, rows);
  return rows[idx];
}

export async function deleteReview(id: string): Promise<boolean> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseServerClient();
    const { error, count } = await supabase.from("reviews").delete({ count: "exact" }).eq("id", id);
    if (error) throw new Error(`Database error: ${error.message}`);
    return (count ?? 0) > 0;
  }

  const rows = readLocal<Review>(FILE);
  const next = rows.filter((r) => r.id !== id);
  const changed = next.length !== rows.length;
  if (changed) writeLocal(FILE, next);
  return changed;
}
