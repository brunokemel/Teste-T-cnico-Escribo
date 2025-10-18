import express, { Request, Response } from 'express';

const app = express();
app.post('/send-email', async (req: Request, res: Response) => {
  try {
    // Verifica se a requisição é POST
    if (req.method !== "POST") {
      return new Response("Método não permitido", { status: 405 });
    }

    // Verifica se o Content-Type é JSON
    const contentType = req.headers['content-type'] || "";
    if (!contentType.includes("application/json")) {
      return new Response("Esperado application/json", { status: 400 });
    }

    const { pedido_id, email } = await req.json();

    console.log(`Enviando e-mail de confirmação para ${email} (pedido #${pedido_id})`);

    return res.status(200).json({ message: "E-mail enviado com sucesso!" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erro ao processar requisição" });
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});