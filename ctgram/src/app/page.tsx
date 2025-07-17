"use client"
import Image from "next/image"

import { useState, useEffect } from "react"
import { Input } from "../components/Input"
import { Button } from "../components/Button"
import { api } from "../services/api"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { z, ZodError } from "zod"
import type React from "react"
import { AxiosError } from "axios"

const loginSchema = z.object({
  email: z.string().email({ message: "E-mail inválido" }),
  password: z.string().min(6, { message: "Senha deve ter pelo menos 6 dígitos" }),
})

export default function Home() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFormValid, setForm] = useState(false);

  const path = usePathname();
  const query = useSearchParams();
  const page = query.get("page");
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
    e.preventDefault()
    try {
      setIsLoading(true)

      const data = loginSchema.parse({
        email,
        password,
      })

      const response = await api.post("/login", { 
        email: data.email,
        password: data.password,
      });

      if (response.data.token) { 
        localStorage.setItem('access_token', response.data.token);
        alert("Login realizado com sucesso!");
        router.push("/editar-foto");
      } else {
        alert("Token de acesso não recebido na resposta do login.");
      }

    } catch (error) {
      if (error instanceof ZodError) {
        return alert(error.issues[0].message);
      }
      if (error instanceof AxiosError) {
        return alert(error.response?.data?.message || "Não foi possível fazer login. Credenciais inválidas.");
      }
      alert("Não foi possível fazer login!");
    }
    finally {
      setIsLoading(false)
    }
  }
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-gray-100">
      <main className="bg-gray-300 w-max p-10 rounded-md flex items-center flex-col md:min-w-[462px]">
        <Image src="https://www.ctjunior.com.br/images/logo/logo-branca-reta-noSlogan.svg" width={300} height={120.75} alt="" className="pb-3" />
        <form onSubmit={onSubmit} className="w-full flex flex-col gap-5 items-center" >
          <Input required legend="E-mail" type="email" placeholder="seu@email.com" onChange={(e) => setEmail(e.target.value)} />
          <Input required legend="Senha" type="password" placeholder="Senha" onChange={(e) => setPassword(e.target.value)} />

          <Button type="submit" isLoading={isLoading} disabled={!isFormValid}>Entrar</Button>

          <p className="text-xs -mb-3">Ainda não tem uma conta?</p>

          <Button type="button" isLoading={isLoading} onClick={() => { router.push("/Cadastro") }}>Cadastre-se</Button>

        </form>

      </main>
    </div>
  )
}