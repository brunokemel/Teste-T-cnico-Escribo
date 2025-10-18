import { serve } from "https://deno.land/std@0.168.0/http/server.ts";


serve(async (req: Request) => {
  try {
    // Verifica se a requisição é POST
    if (req.method !== "POST") {
      return new Response("Método não permitido", { status: 405 });
    }

    // Verifica se o Content-Type é JSON
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return new Response("Esperado application/json", { status: 400 });
    }

    const { pedido_id, email } = await req.json();

    console.log(`Enviando e-mail de confirmação para ${email} (pedido #${pedido_id})`);

    return new Response("E-mail enviado com sucesso!", { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response("Erro ao processar requisição", { status: 500 });
  }
});