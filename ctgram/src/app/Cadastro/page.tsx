"use client"

import { useEffect, useState } from "react"

import { Input } from "../../components/Input"
import { Button } from "../../components/Button"
import { api } from "../../services/api"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { z, ZodError } from "zod"
import Image from "next/image"
import type React from "react"
import Link from "next/link"

const signUpSchema = z.object({
    nome: z.string().trim().min(1, { message: "Informe o nome" }),
    email: z.string().email({ message: "E-mail inválido" }),
    password: z.string().min(6, { message: "Senha deve ter pelo menos 6 dígitos" }),
    npassword: z.string({message: "Confirme a senha"})
}).refine ((data) => data.password === data.npassword,{
message: "As senhas não são iguais",
path: ["npassword"],
})
export default function Cadastro() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [nome, setNome] = useState("");
    const [npassword, setNewPassword] = useState("");
    const [isFormValid, setForm] = useState(false);

    const path = usePathname();
    const query = useSearchParams();
    const page = query.get("page");
    const router = useRouter();

  useEffect(() => {
    try {

      signUpSchema.parse({ nome, email, password, npassword });
      setForm(true); 
    } catch (error) {
      setForm(false); 
    }
  }, [nome, email, password, npassword]);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault()
        try {
            setIsLoading(true)

            const data = signUpSchema.parse({
                nome,
                email,
                password,
                npassword,
            })
            // await api.post("/users", data);

            // if(confirm("Cadastro realizado!. Ir para a página inicial?")){
            //     <Link href="/"/>
            // }

        } catch (error) {
            if (error instanceof ZodError) {
                return alert(error.issues[0].message)
            }
            alert("Não foi possível cadastrar!");
        }
        finally{
            setIsLoading(false)
        }
    }
    return (
        <div className="w-screen h-screen flex flex-col items-center justify-center bg-gray-100">
            <main className="bg-gray-300 w-max p-10 rounded-md flex items-center flex-col md:min-w-[462px]">
                <Image src="https://www.ctjunior.com.br/images/logo/logo-branca-reta-noSlogan.svg" width={300} height={120.75} alt="" className="pb-3" />
                <form onSubmit={onSubmit} className="w-full flex flex-col gap-5 items-center" >
                    <Input required legend="Nome" type="text" placeholder="Nome" onChange={(e) => setNome(e.target.value)} />
                    <Input required legend="E-mail" type="email" placeholder="seu@email.com" onChange={(e) => setEmail(e.target.value)} />
                    <Input required legend="Senha" type="password" placeholder="Senha" onChange={(e) => setPassword(e.target.value)} />
                    <Input required legend="Digite a senha novamente" type="password" placeholder="Confirmação de Senha" onChange={(e) => setNewPassword(e.target.value)} />
                    <Button type="submit" isLoading={isLoading} disabled={!isFormValid}>Confirmar</Button>

                    <Button type="submit" isLoading={isLoading} onClick={() => { router.push("/") }}>Login</Button>
                </form>
            </main>
        </div>
    )
}