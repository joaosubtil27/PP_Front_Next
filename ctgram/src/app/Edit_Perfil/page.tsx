"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import React from "react";

import { Sidebar } from "@/components/Sidebar";

export default function EditarFoto() {
  const BACKEND_URL = "http://localhost:3331";

  const IMAGEM_DEFAULT_LOCAL = "https://i.pinimg.com/736x/41/af/40/41af40966240f4b53abed779e59005ff.jpg";

  const [imgUrl, setImgUrl] = useState(IMAGEM_DEFAULT_LOCAL);
  const [campo, setCampo] = useState("");

  const getAuthToken = (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('access_token');
    }
    return null;
  };

  useEffect(() => {
    const fetchProfileImage = async () => {
      const token = getAuthToken();
      if (!token) {
        setImgUrl(IMAGEM_DEFAULT_LOCAL);
        return;
      }

      try {
        const response = await fetch(`${BACKEND_URL}/photo`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          setImgUrl(IMAGEM_DEFAULT_LOCAL);
          return;
        }

        const data = await response.json();
        if (data.foto) {
          setImgUrl(data.foto);
        } else {
          setImgUrl(IMAGEM_DEFAULT_LOCAL);
        }
      } catch (error) {
        setImgUrl(IMAGEM_DEFAULT_LOCAL);
      }
    };

    fetchProfileImage();
  }, []);

  const trocarImagem = async (e: React.FormEvent) => {
    e.preventDefault();
    const novaUrl = campo.trim();

    if (!novaUrl) {
      setImgUrl(IMAGEM_DEFAULT_LOCAL);
      setCampo('');
      return;
    }

    const token = getAuthToken();
    if (!token) {
      setImgUrl(novaUrl);
      setCampo('');
      return;
    }

    setImgUrl(novaUrl);
    setCampo('');

    try {
      const response = await fetch(`${BACKEND_URL}/photo`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ foto: novaUrl }),
      });

      if (!response.ok) {
        return;
      }
    } catch (error) {
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar/>
      <div className="flex-1 flex items-center justify-center p-4">
        <main className="flex flex-col items-center p-6 bg-white shadow-xl rounded-xl max-w-sm w-full">
          <Image src={imgUrl} alt="foto do usuário" width={200} height={200} className="rounded-full mb-4 object-cover" />
          <form onSubmit={trocarImagem} className="w-full flex flex-col gap-3">
            <input
              type="url"
              required
              placeholder="Cole a URL da sua imagem"
              value={campo}
              onChange={(e) => setCampo(e.target.value)}
              className="p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            <button
              type="submit"
              className="w-full bg-black text-white p-3 rounded-lg font-semibold hover:bg-orange-500 transition duration-200"
            >
              Atualizar
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}