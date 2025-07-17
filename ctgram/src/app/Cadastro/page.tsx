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
import { AxiosError } from "axios"

const signUpSchema = z.object({
    username: z.string().trim().min(1, { message: "Informe o nome" }),
    email: z.string().email({ message: "E-mail inválido" }),
    password: z.string().min(6, { message: "Senha deve ter pelo menos 6 dígitos" }),
    newpassword: z.string({ message: "Confirme a senha" })
}).refine((data) => data.password === data.newpassword, {
    message: "As senhas não são iguais",
    path: ["newpassword"],
})
export default function Cadastro() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [username, setUsername] = useState("");
    const [newpassword, setNewPassword] = useState("");
    const [isFormValid, setForm] = useState(false);

    const path = usePathname();
    const query = useSearchParams();
    const page = query.get("page");
    const router = useRouter();

    useEffect(() => {
        try {

            signUpSchema.parse({ username, email, password, newpassword });
            setForm(true);
        } catch (error) {
            setForm(false);
        }
    }, [username, email, password, newpassword]);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault()
        try {
            setIsLoading(true)

            const data = signUpSchema.parse({
                username,
                email,
                password,
                newpassword
            })
            console.log(username, email, password, newpassword);
            const envio = {
                email: data.email,
                password: data.password,
                username: data.username,
            }
            await api.post("/user", envio);

            if (confirm("Cadastro realizado!")){}

        } catch (error) {
            if (error instanceof ZodError) {
                return alert(error.issues[0].message)
            }
            if (error instanceof AxiosError)
                return alert(error.response?.data.message)

            alert("Não foi possível cadastrar!");
        }
        finally {
            setIsLoading(false)
        }
    }
    return (
        <div id="inicial">
            <main id="box">
                <Image src="https://www.ctjunior.com.br/images/logo/logo-branca-reta-noSlogan.svg" width={300} height={120.75} alt="" className="pb-3" />
                <form onSubmit={onSubmit} className="w-full flex flex-col gap-5 items-center" >
                    <Input required legend="Nome" type="text" placeholder="Nome" onChange={(e) => setUsername(e.target.value)} />
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