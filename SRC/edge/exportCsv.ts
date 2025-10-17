import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "@supabase/supabase-js";
import { Parser } from "npm:json2csv";

const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

serve(async (req) => {
  const { cliente_id } = await req.json();

  const { data, error } = await supabase
    .from("vw_pedidos_detalhes")
    .select("*")
    .eq("cliente_id", cliente_id);

  if (error) return new Response(JSON.stringify(error), { status: 400 });

  const parser = new Parser();
  const csv = parser.parse(data);

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": "attachment; filename=pedidos.csv"
    }
  });
});