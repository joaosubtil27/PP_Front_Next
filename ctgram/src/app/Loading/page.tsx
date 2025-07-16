import Image from "next/image"

export default function Loading() {
    return (
        <div className="w-screen h-screen flex flex-col items-center justify-center bg-gray-100">
            <main className="flex flex-col items-center justify-center p-10 gap-5 bg-gray-300 rounded-md">
                <Image src="https://www.ctjunior.com.br/images/logo/logo-branca-reta-noSlogan.svg" width={300} height={120.75} alt="" className="pb-3" />
                <h1  className="text-2xl"><strong>A página já está carregando</strong></h1>
                <h2>Espere mais alguns instantes</h2>
            </main>
        </div>
    )
}