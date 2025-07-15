import { useState } from "react"
import { Input } from "../components/Input/Input"
import { Button } from "../components/Button/Button"
import type React from "react"
import { href } from "react-router";
export function Cadastro() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    function onSubmit(e: React.FormEvent) {
        e.preventDefault()
        alert("Enviado!")
    }
    return (
        <form onSubmit={onSubmit} className="w-full flex flex-col gap-5 items-center" >
            <Input required legend="E-mail" type="email" placeholder="seu@email.com" onChange={(e) => setEmail(e.target.value)} />
            <Input required legend="Senha" type="password" placeholder="Senha" onChange={(e) => setPassword(e.target.value)} />

            <Button type="submit" isLoading={isLoading}> Entrar </Button>

            <p className="text-xs">Ainda não tem uma conta?</p>

            <Button isLoading={isLoading}> <a href="/Cadastro">Cadastre-se</a> </Button>

        </form>
    )
}