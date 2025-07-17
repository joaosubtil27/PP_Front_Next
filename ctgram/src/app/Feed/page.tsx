
"use client";

import { useEffect, useState } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { Post } from '../../components/Post';
import { api } from '../../services/api';
import { AxiosError } from 'axios';
import Image from 'next/image'; 


interface PostData {
  id: string; 
  foto: string;
  description: string | null;
  createdAt: string; 
  author: { 
    id?: string; 
    username: string;
    
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
        setError(null); 
        
        const response = await api.get('/feed'); 
        
        
        const fetchedPosts = response.data.posts.map((item: any) => ({
          id: item.post_id, 
          foto: item.foto,
          description: item.description,
          createdAt: item.posted_at, 
          author: {
            username: item.username,
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
  }, []); 

  return (
    <div id="site-sb">
      <Sidebar />
      <main className="flex-1 flex-col p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-6">Seu Feed</h1>

        {loading && (
          <div className="flex justify-center items-center h-48">
            <p>Carregando posts...</p>
            
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
  author={post.author} 
/>
          ))}
        </div>
      </main>
    </div>
  );
}