import { Button } from "@/components/Button"
import Link from "next/link"

export default function NotFound() {
    return (
        <div className="w-screen h-screen flex flex-col items-center justify-center bg-gray-100">
            <main className=" p-10 bg-gray-300 border-md">
            <h1 className="">ERRO 404</h1>
            <h2>Vish! Essa página não existe. Volte à página inicial</h2>
            <Link href="/">
                <Button>Início</Button>
            </Link>
            </main>
        </div>

    )
}