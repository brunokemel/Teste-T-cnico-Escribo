import { serve } from "https://deno.land/std@0.201.0/http/server.ts";
import { createClient } from "@supabase/supabase-js";
import { Parser } from "https://esm.sh/json2csv@6.5.0";


const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);


serve(async (req: Request) => {
  const { cliente_id, formato = "csv" } = await req.json();

  if (!cliente_id || typeof cliente_id !== "string") {
    return new Response("cliente_id inválido", { status: 400 });
  }

  const { data, error } = await supabase
    .from("vw_pedidos_detalhes")
    .select("*")
    .eq("cliente_id", cliente_id);

  if (error) {
    console.error("Erro Supabase:", error);
    return new Response(JSON.stringify({ erro: "Erro ao buscar dados", detalhes: error }), {
      status: 500,
    });
  }

  if (!data || data.length === 0) {
    return new Response("Nenhum dado encontrado para o cliente", { status: 404 });
  }

  switch (formato.toLowerCase()) {
    case "json":
      return new Response(JSON.stringify(data), {
        headers: {
          "Content-Type": "application/json",
        },
      });

    case "csv":
      const parser = new Parser();
      const csv = parser.parse(data);
      return new Response(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": "attachment; filename=pedidos.csv",
        },
      });

    default:
      return new Response("Formato não suportado. Use 'csv' ou 'json'.", { status: 400 });
  }
});
