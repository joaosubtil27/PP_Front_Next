"use client"

import { use, useState } from "react"
import { Input } from "../../components/Input"
import { Button } from "../../components/Button"
import type React from "react"

export function Cadastro() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [nome, setNome] = useState("");

    function onSubmit(e: React.FormEvent) {
        e.preventDefault()
        alert("Enviado!")
    }
    return (
        <form onSubmit={onSubmit} className="w-full flex flex-col gap-5 items-center" >
            <Input required legend="Nome" type="text" placeholder="Nome" onChange={(e) => setNome(e.target.value)} />
            <Input required legend="E-mail" type="email" placeholder="seu@email.com" onChange={(e) => setEmail(e.target.value)} />
            <Input required legend="Senha" type="password" placeholder="Senha" onChange={(e) => setPassword(e.target.value)} />
            <Input required legend="Digite a senha novamente" type="password" placeholder="Confirmação de Senha" onChange={(e) => setPassword(e.target.value)} />

            <Button type="submit" isLoading={isLoading}> Entrar </Button>
        </form>
    )
}