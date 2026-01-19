import supabase from "./supabase-client";

export async function saveStageState(stageId, state) {
  const { error } = await supabase
    .from("stages")
    .update({
      state,
      updated_at: new Date().toISOString(),
    })
    .eq("stage_id", stageId);

  if (error) throw error;
}
