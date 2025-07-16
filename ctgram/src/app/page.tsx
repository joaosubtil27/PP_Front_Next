"use client"
import Image from "next/image"
import Link from "next/link"
import { Sidebar } from "@/components/Sidebar"
import { useState } from "react"
import { Input } from "../components/Input"
import { Button } from "../components/Button"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import type React from "react"


export default function Home() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const path = usePathname();
  const query = useSearchParams();
  const page = query.get("page");
  const router = useRouter();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    alert("Enviado!")
  }
  return (
      <div className="w-screen h-screen flex flex-col items-center justify-center bg-gray-100">
        <main className="bg-gray-300 w-max p-10 rounded-md flex items-center flex-col md:min-w-[462px]">
          <Image src="https://www.ctjunior.com.br/images/logo/logo-branca-reta-noSlogan.svg" width={300} height={120.75} alt="" className="pb-3" />
          <form onSubmit={onSubmit} className="w-full flex flex-col gap-5 items-center" >
            <Input required legend="E-mail" type="email" placeholder="seu@email.com" onChange={(e) => setEmail(e.target.value)} />
            <Input required legend="Senha" type="password" placeholder="Senha" onChange={(e) => setPassword(e.target.value)} />

            <Button type="submit" isLoading={isLoading}>Entrar</Button>

            <p className="text-xs -mb-3">Ainda não tem uma conta?</p>

            <Button isLoading={isLoading} onClick={() => { router.push("/Cadastro") }}>Cadrastre-se</Button>

          </form>

        </main>
      </div>
  )
}