"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { api } from "../../services/api"; 
import { AxiosError } from "axios";
import { Post } from "../../components/Post";
import { Sidebar } from "../../components/Sidebar"; 


interface UserPostData {
  id: string; 
  foto: string;
  description: string | null;
  createdAt: string; 
  username: string; 
}

export default function PerfilPage() { 
  const IMAGEM_PADRAO_USUARIO = "https://i.pinimg.com/736x/1a/a8/d7/1aa8d75f3498784bcd2617b3e3d1e0c4.jpg"; 

  
  const [userPosts, setUserPosts] = useState<UserPostData[]>([]);
  const [loadingPosts, setLoadingPosts] = useState<boolean>(true);
  const [errorPosts, setErrorPosts] = useState<string | null>(null);
  const [loggedInUsername, setLoggedInUsername] = useState<string | null>(null);
 
  useEffect(() => {
   
   const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
     setLoggedInUsername(storedUsername);
   }
    async function fetchUserPosts() {
      try {
        setLoadingPosts(true);
        setErrorPosts(null);
       
        const response = await api.get('/my-posts'); 
        
        
        const fetchedPosts = response.data.posts.map((item: any) => ({
          id: item.post_id,
          foto: item.foto,
          description: item.description,
          createdAt: item.posted_at,
          username: item.username,
        }));

        setUserPosts(fetchedPosts);

      } catch (err) {
        if (err instanceof AxiosError && err.response) {
          const backendMessage = (err.response.data as { message?: string | string[] })?.message;
          if (Array.isArray(backendMessage)) {
            setErrorPosts(`Erro ao carregar seus posts: ${backendMessage.join(', ')}`);
          } else {
            setErrorPosts(`Erro ao carregar seus posts: ${backendMessage || "Erro desconhecido do servidor."}`);
          }
        } else {
          setErrorPosts(`Não foi possível carregar seus posts! Erro inesperado: ${err instanceof Error ? err.message : "Desconhecido"}`);
        }
      } finally {
        setLoadingPosts(false);
      }
    }

    fetchUserPosts();
  }, []); 

  return (
    <div id="site-sb"> 
      <Sidebar /> 
      
      <main className="flex-1 p-8 overflow-y-auto"> 
        <h1 className="text-3xl font-bold mb-6 text-center">Meu Perfil</h1>

        
        <section className="mb-8 flex flex-col items-center">
          <Image 
            src={IMAGEM_PADRAO_USUARIO} 
            alt="Foto do usuário" 
            width={150} 
            height={150} 
            className="rounded-full border-4 border-orange-500 mb-4" 
            style={{ objectFit: 'cover' }}
          />
          {loggedInUsername ? (
            <p className="text-gray-700 font-semibold text-xl">{loggedInUsername}</p> 
         ) : (
            <p className="text-gray-700 font-semibold text-xl">Carregando nome...</p>
          )}
        </section>

        <hr className="my-8 border-gray-300" />

        
        <section>
          <h2 className="text-2xl font-bold mb-4 text-center">Minhas Publicações</h2>

          {loadingPosts && (
            <div className="flex justify-center items-center h-48">
              <p>Carregando suas publicações...</p>
            </div>
          )}

          {errorPosts && (
            <div className="text-red-500 text-center mb-4">
              <p>{errorPosts}</p>
            </div>
          )}

          {!loadingPosts && !errorPosts && userPosts.length === 0 && (
            <div className="text-gray-600 text-center">
              <p>Você ainda não fez nenhuma publicação.</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6"> 
            {!loadingPosts && !errorPosts && userPosts.map((post) => (
<Post
  key={post.id}
  id={post.id}
  foto={post.foto}
  description={post.description}
  createdAt={post.createdAt}
  
/>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}