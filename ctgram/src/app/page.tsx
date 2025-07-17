"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { useRouter } from "next/navigation";
import { z, ZodError } from "zod";
import type React from "react";
import { api } from "../services/api";
import { AxiosError } from "axios";


const loginSchema = z.object({
  email: z.string().email({ message: "E-mail inválido" }),
  password: z.string().min(6, { message: "Senha deve ter pelo menos 6 dígitos" }),
});

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFormValid, setForm] = useState(false);

  const router = useRouter();
  useEffect(() => {
    try {
      loginSchema.parse({ email, password });
      setForm(true);
    } catch (error) {
      setForm(false);
    }
  }, [email, password]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setIsLoading(true);

      const data = loginSchema.parse({
        email,
        password,
      });

      const response = await api.post("/login", data);


const { token, username } = response.data;
localStorage.setItem("authToken", token);
localStorage.setItem("username", username);


      alert("Login realizado com sucesso!");
      router.push("/Feed");

    } catch (error) {

      if (error instanceof ZodError) {
        return alert(error.issues[0].message);
      }
      if (error instanceof AxiosError && error.response) {
        const backendMessage = (error.response.data as { message?: string | string[] })?.message;
        if (Array.isArray(backendMessage)) {
            alert(`Erro no login: ${backendMessage.join(', ')}`);
        } else {
            alert(`Erro no login: ${backendMessage || "Erro desconhecido do servidor."}`);
        }
      } else {

        alert(`Não foi possível realizar o login! Erro inesperado: ${error instanceof Error ? error.message : "Desconhecido"}`);
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div id = "inicial">
      <main id = "box">
        <Image src="https://www.ctjunior.com.br/images/logo/logo-branca-reta-noSlogan.svg" width={300} height={120.75} alt="" className="pb-3" />
        

        <form onSubmit={onSubmit} className="w-full flex flex-col gap-5 items-center">
          <Input 
            required 
            legend="E-mail" 
            type="email" 
            placeholder="seu@email.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input 
            required 
            legend="Senha" 
            type="password" 
            placeholder="Senha" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button type="submit" isLoading={isLoading} disabled={!isFormValid}>
            Entrar
          </Button>

          <p className="text-xs -mb-3">Ainda não tem uma conta?</p>

          <Button type="button" isLoading={isLoading} onClick={() => { router.push("/Cadastro") }}>
            Cadastre-se
          </Button>
        </form>
      </main>
    </div>
  );
}