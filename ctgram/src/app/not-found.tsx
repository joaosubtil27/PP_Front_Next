import { Button } from "@/components/Button"
import Link from "next/link"

export default function NotFound() {
    return (
        <div className="w-screen h-screen flex flex-col items-center justify-center bg-gray-100">
            <main className="flex flex-col items-center justify-center p-10 gap-5 bg-gray-300 rounded-md">
            <h1 className="text-4xl"><strong>ERROR 404</strong></h1>
            <h2>Vish! Essa página não existe. Volte à página inicial.</h2>
            <Link href="/">
                <Button>Início</Button>
            </Link>
            </main>
        </div>

    )
}