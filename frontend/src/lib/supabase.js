import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://bvrqnzpmfpqshzmvqbmi.supabase.co";
const supabaseKey = "sb_publishable_fYrojL3E8ZRojS4ZZY1Grg_mWyOlySv";

export const supabase = createClient(supabaseUrl, supabaseKey);