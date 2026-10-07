import { randomUUID } from "crypto";
import { isSupabaseConfigured, getSupabaseServerClient } from "./supabase";
import { readLocal, writeLocal } from "./localFile";
import type { BlockedSlot, NewBlockedSlotInput } from "../types";

const FILE = "blocked-slots.json";

export async function listBlockedSlots(date?: string): Promise<BlockedSlot[]> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseServerClient();
    let query = supabase.from("blocked_slots").select("*").order("date", { ascending: true });
    if (date) query = query.eq("date", date);
    const { data, error } = await query;
    if (error) throw new Error(`Database error: ${error.message}`);
    return data as BlockedSlot[];
  }

  const rows = readLocal<BlockedSlot>(FILE);
  return date ? rows.filter((r) => r.date === date) : rows;
}

export async function createBlockedSlot(input: NewBlockedSlotInput): Promise<BlockedSlot> {
  const row: BlockedSlot = {
    id: randomUUID(),
    created_at: new Date().toISOString(),
    ...input
  };

  if (isSupabaseConfigured()) {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase.from("blocked_slots").insert(row).select().single();
    if (error) throw new Error(`Database error: ${error.message}`);
    return data as BlockedSlot;
  }

  const rows = readLocal<BlockedSlot>(FILE);
  rows.push(row);
  writeLocal(FILE, rows);
  return row;
}

export async function deleteBlockedSlot(id: string): Promise<boolean> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseServerClient();
    const { error, count } = await supabase.from("blocked_slots").delete({ count: "exact" }).eq("id", id);
    if (error) throw new Error(`Database error: ${error.message}`);
    return (count ?? 0) > 0;
  }

  const rows = readLocal<BlockedSlot>(FILE);
  const next = rows.filter((r) => r.id !== id);
  const changed = next.length !== rows.length;
  if (changed) writeLocal(FILE, next);
  return changed;
}
