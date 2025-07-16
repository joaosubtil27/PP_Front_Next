"use client"
import Image from "next/image"

import { useState, useEffect } from "react"
import { Input } from "../components/Input"
import { Button } from "../components/Button"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { z, ZodError } from "zod"
import type React from "react"

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
      // Tenta validar o esquema com os valores atuais
      loginSchema.parse({ email, password });
      setForm(true); // Se passou, o formulário é válido
    } catch (error) {
      setForm(false); // Se deu erro, o formulário é inválido
    }
  }, [email, password]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      setIsLoading(true)

      const data = loginSchema.parse({
        email,
        password,
      })
    } catch (error) {
      if (error instanceof ZodError) {
        return alert(error.issues[0].message)
      }
      alert("Não foi possível cadastrar!");
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

          <Button type="submit" isLoading={isLoading} disabled={!isFormValid} onClick={() => { router.push("/Cadastro") }}>Entrar</Button>

          <p className="text-xs -mb-3">Ainda não tem uma conta?</p>

          <Button isLoading={isLoading} onClick={() => { router.push("/Cadastro") }}>Cadrastre-se</Button>

        </form>

      </main>
    </div>
  )
}
