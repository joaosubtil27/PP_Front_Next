"use client"; // Mantenha esta linha para indicar um Client Component

import Image from "next/image";
import { useEffect, useState } from "react"; // Descomentado useState e useEffect
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { useRouter } from "next/navigation"; // usePathname e useSearchParams não são estritamente necessários para o login básico aqui
import { z, ZodError } from "zod";
import type React from "react";
import { api } from "../services/api"; // Importe a instância da API
import { AxiosError } from "axios"; // Para um tratamento de erros mais robusto

// Esquema de validação para o login
const loginSchema = z.object({
  email: z.string().email({ message: "E-mail inválido" }),
  password: z.string().min(6, { message: "Senha deve ter pelo menos 6 dígitos" }),
});

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFormValid, setForm] = useState(false); // Para habilitar/desabilitar o botão

  const router = useRouter();

  // Efeito para validar o formulário em tempo real
  useEffect(() => {
    try {
      loginSchema.parse({ email, password });
      setForm(true);
    } catch (error) {
      setForm(false);
    }
  }, [email, password]);

  // Função para lidar com o envio do formulário de login
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault(); // Previne o comportamento padrão do formulário
    try {
      setIsLoading(true);

      // Valida os dados do formulário com Zod
      const data = loginSchema.parse({
        email,
        password,
      });

      // Faz a requisição POST para o endpoint de login da sua API
      // ALERTA: Verifique qual é o endpoint real de login no seu backend (ex: /auth/login, /login)
      const response = await api.post("/login", data);

// <<< ADICIONE ESTA LINHA: Salva o token no localStorage
const { token, username } = response.data;
localStorage.setItem("authToken", token); // Usando /auth/login como exemplo
localStorage.setItem("username", username);

      // Se o login for bem-sucedido:
      alert("Login realizado com sucesso!");
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
            alert(`Erro no login: ${backendMessage.join(', ')}`);
        } else {
            alert(`Erro no login: ${backendMessage || "Erro desconhecido do servidor."}`);
        }
      } else {
        // Para outros tipos de erro (rede, etc.)
        alert(`Não foi possível realizar o login! Erro inesperado: ${error instanceof Error ? error.message : "Desconhecido"}`);
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-gray-100">
      <main className="bg-gray-300 w-max p-10 rounded-md flex items-center flex-col md:min-w-[462px]">
        <Image src="https://www.ctjunior.com.br/images/logo/logo-branca-reta-noSlogan.svg" width={300} height={120.75} alt="" className="pb-3" />
        
        {/* A propriedade 'action' foi removida pois estamos usando onSubmit */}
        <form onSubmit={onSubmit} className="w-full flex flex-col gap-5 items-center">
          <Input 
            required 
            legend="E-mail" 
            type="email" 
            placeholder="seu@email.com" 
            value={email} // Conecta ao estado
            onChange={(e) => setEmail(e.target.value)} // Atualiza o estado
          />
          <Input 
            required 
            legend="Senha" 
            type="password" 
            placeholder="Senha" 
            value={password} // Conecta ao estado
            onChange={(e) => setPassword(e.target.value)} // Atualiza o estado
          />

          <Button type="submit" isLoading={isLoading} disabled={!isFormValid}>
            Entrar
          </Button>

          <p className="text-xs -mb-3">Ainda não tem uma conta?</p>

          {/* Este botão redireciona para o cadastro */}
          <Button type="button" isLoading={isLoading} onClick={() => { router.push("/Cadastro") }}>
            Cadastre-se
          </Button>
        </form>
      </main>
    </div>
  );
}