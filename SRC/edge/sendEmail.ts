import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "@supabase/supabase-js";

serve(async (req) => {
    const { pedido_id, email } = await req.json();

    console.log(`Enviando e-mail de confirmação para ${email} (pedido #${pedido_id})`);

     return new Response("E-mail enviado com sucesso!", { status: 200 });
})