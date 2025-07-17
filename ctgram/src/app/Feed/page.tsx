// src/app/Feed/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { Post } from '../../components/Post'; // Importe o componente Post
import { api } from '../../services/api';
import { AxiosError } from 'axios';
import Image from 'next/image'; // Para o loading state, se quiser

// Defina a interface para o tipo de dado que você espera para cada post
// Isso DEVE corresponder ao que seu backend retorna para um post
interface PostData {
  id: string; // post_id no backend mapeia para id no frontend
  foto: string;
  description: string | null;
  createdAt: string; // posted_at no backend mapeia para createdAt no frontend
  author: { // Dados do autor do post
    id?: string; // O backend não retorna o ID do autor diretamente no 'user' aninhado
    username: string;
    // Se o backend retornasse outros campos do autor, adicione aqui
  };
}

export default function FeedPage() {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true);
        setError(null); // Limpa erros anteriores

        // <<< CORRIGIDO: Endpoint agora é '/feed' >>>
        const response = await api.get('/feed'); 
        
        // O backend retorna { posts: [...] }, então acesse response.data.posts
        // E mapeie os nomes dos campos do backend para os nomes esperados no frontend (PostData)
        const fetchedPosts = response.data.posts.map((item: any) => ({
          id: item.post_id, // Mapeia post_id do backend para id no frontend
          foto: item.foto,
          description: item.description,
          createdAt: item.posted_at, // Mapeia posted_at do backend para createdAt no frontend
          author: {
            username: item.username, // Pega o username do autor
          },
        }));

        setPosts(fetchedPosts);

      } catch (err) {
        if (err instanceof AxiosError && err.response) {
          const backendMessage = (err.response.data as { message?: string | string[] })?.message;
          if (Array.isArray(backendMessage)) {
            setError(`Erro ao carregar posts: ${backendMessage.join(', ')}`);
          } else {
            setError(`Erro ao carregar posts: ${backendMessage || "Erro desconhecido do servidor."}`);
          }
        } else {
          setError(`Não foi possível carregar os posts! Erro inesperado: ${err instanceof Error ? err.message : "Desconhecido"}`);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []); // O array vazio significa que o efeito roda apenas uma vez ao montar

  return (
    <div className="flex w-screen h-screen">
      <Sidebar />
      <main className="flex-1 flex-col p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-6">Seu Feed</h1>

        {loading && (
          <div className="flex justify-center items-center h-48">
            <p>Carregando posts...</p>
            {/* Você pode adicionar um spinner de loading aqui */}
          </div>
        )}

        {error && (
          <div className="text-red-500 text-center mb-4">
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && posts.length === 0 && (
          <div className="text-gray-600 text-center">
            <p>Nenhum post encontrado. Que tal criar um?</p>
          </div>
        )}

        <div className="justify-center grid grid-rows-1 md:grid-rows-2 lg:grid-rows-3 gap-6">
          {!loading && !error && posts.map((post) => (
<Post
  key={post.id}
  id={post.id}
  foto={post.foto}
  description={post.description}
  createdAt={post.createdAt}
  author={post.author} // <<< Passe o objeto author normalmente
/>
          ))}
        </div>
      </main>
    </div>
  );
}