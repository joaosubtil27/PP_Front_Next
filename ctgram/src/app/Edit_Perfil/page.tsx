"use client";

import Image from "next/image";
import { useState } from "react";

export default function EditarFoto() {
  const IMAGEM_DEFAULT = "https://i.pinimg.com/736x/1a/a8/d7/1aa8d75f3498784bcd2617b3e3d1e0c4.jpg";

  const [imgUrl, setImgUrl] = useState(IMAGEM_DEFAULT);
  const [campo, setCampo] = useState("");

  const trocarImagem = (e: Event) => {
    e.preventDefault();
    if (campo.trim()) setImgUrl(campo.trim());
    setCampo('');
  };

  return (
    <main>
      <Image src={imgUrl} alt="foto do usuário" width={200} height={200} />
      <form onSubmit={trocarImagem}>
        <input type="url" required placeholder="Cole a URL da sua imagem" value={campo} onChange={(e) => setCampo(e.target.value)} />

        <button type="submit">Atualizar</button>
      </form>
    </main>
  );
}