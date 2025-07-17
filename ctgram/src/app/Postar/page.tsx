"use client"
import { Sidebar } from "../../components/Sidebar"
import { Input } from "@/components/Input"
import {Button} from "@/components/Button"
import { useState } from "react";
import { api } from "@/services/api";
import { AxiosError } from "axios";
import { z, ZodError } from "zod";
import type React from "react";
import { useRouter } from "next/navigation"; // usePathname e useSearchParams não são estritamente necessários para o login básico aqui

const PostSchema = z.object({
  description: z.string().max(200, { message: "A descrição deve ter no máximo 200 caracteres." }).optional().nullable(),
  foto: z.string().url(),
});

export default function Post() {

  const [foto, setFoto] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

async function onSubmit(e: React.FormEvent) {
    e.preventDefault(); // Previne o comportamento padrão do formulário
    try {
      setIsLoading(true);
      // Valida os dados do formulário com Zod
      const data = PostSchema.parse({
        foto,
        description,
      });
      console.log('DEBUG Frontend: Dados sendo enviados para o backend:', data);
console.log('DEBUG Frontend: Verificando token JWT no localStorage:', localStorage.getItem('authToken')); // Verifique se o token existe
      // Faz a requisição POST para o endpoint de login da sua API
      // ALERTA: Verifique qual é o endpoint real de login no seu backend (ex: /auth/login, /login)
      await api.post("/post", data); // Usando /auth/login como exemplo

      // Se o login for bem-sucedido:
      alert("Foto publicada com sucesso!");
      router.push("/Feed"); // Redireciona para uma página protegida (ex: /Postar)

    } catch (error) {
      // Trata erros de validação do Zod no frontend
      if (error instanceof ZodError) {
        return alert(error.issues[0].message);
      }
      // Trata erros da API (AxiosError)
      if (error instanceof AxiosError && error.response) {
        const backendMessage = (error.response.data as { message?: string | string[] })?.message;
        if (Array.isArray(backendMessage)) {
            alert(`Erro ao postar: ${backendMessage.join(', ')}`);
        } else {
            alert(`Erro ao postar: ${backendMessage || "Erro desconhecido do servidor."}`);
        }
      } else {
        // Para outros tipos de erro (rede, etc.)
        alert(`Não foi possível postar! Erro inesperado: ${error instanceof Error ? error.message : "Desconhecido"}`);
      }
    } finally {
      setIsLoading(false);
    }
  }

    return (
        <div id="site-sb">
            <Sidebar />
            <div className="w-screen h-screen flex justify-center items-center align-middle">
                <main className="bg-gray-300 p-10 rounded-md  border-2 border-orange-400">
                    
                     <form onSubmit={onSubmit} className="w-full flex flex-col gap-5 items-center">
                      <h1 className="text-4xl"><strong>Postar nova foto</strong></h1>
                    <h2>Link para nova foto</h2>
                    <Input required
                        type="text"
                        placeholder="Link da imagem"
                        onChange={(e) => setFoto(e.target.value)} />
                    <h2 className="gap-5">Descrição</h2>
                    <Input
                        type="text"
                        placeholder="Descrição (opcional)"
                        onChange={(e) => setDescription(e.target.value)} />
                    <Button type="submit" isLoading={isLoading}>Postar</Button>
                    </form>
                </main>
            </div>
        </div>
    )
}