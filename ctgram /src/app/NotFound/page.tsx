import { Button } from "@/components/Button"
import Link from "next/link"

export function NotFound() {
    return (
        <div>
            <h1>Vish! Essa página não existe</h1>
            <Link href="/">
                <Button>Volta ao início</Button>
            </Link>
        </div>

    )
}