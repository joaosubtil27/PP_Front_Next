"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { api } from "../../services/api"; // Importe a instância da API
import { AxiosError } from "axios";
import { Post } from "../../components/Post"; // Importe o componente Post
import { Sidebar } from "../../components/Sidebar"; // Importe a Sidebar

// Defina a interface para o tipo de dado que você espera para cada post
// Isso DEVE corresponder ao que seu backend retorna para um post (via FetchUserPostsController)
interface UserPostData {
  id: string; // post_id no backend mapeia para id no frontend
  foto: string;
  description: string | null;
  createdAt: string; // posted_at no backend mapeia para createdAt no frontend
  username: string; // O backend retorna 'username' diretamente no item do post
}

export default function PerfilPage() { // Renomeado para PerfilPage para clareza
  const IMAGEM_PADRAO_USUARIO = "https://i.pinimg.com/736x/1a/a8/d7/1aa8d75f3498784bcd2617b3e3d1e0c4.jpg"; // URL de foto de perfil padrão

  // Estado para os posts do usuário
  const [userPosts, setUserPosts] = useState<UserPostData[]>([]);
  const [loadingPosts, setLoadingPosts] = useState<boolean>(true);
  const [errorPosts, setErrorPosts] = useState<string | null>(null);
  const [loggedInUsername, setLoggedInUsername] = useState<string | null>(null);
  // Efeito para buscar os posts do usuário ao carregar a página
  useEffect(() => {
   // <<< ADICIONADO: Ler o username do localStorage ao carregar >>>
   const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
     setLoggedInUsername(storedUsername);
   }
    async function fetchUserPosts() {
      try {
        setLoadingPosts(true);
        setErrorPosts(null);
        // Endpoint: GET /my-posts (do FetchUserPostsController)
        const response = await api.get('/my-posts'); 
        
        // Mapeia os dados do backend para o formato esperado pelo frontend (UserPostData)
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
  }, []); // Roda apenas uma vez ao montar o componente

  return (
    <div className="flex w-screen h-screen"> {/* Layout flexível para Sidebar e conteúdo */}
      <Sidebar /> {/* Inclua a Sidebar */}
      
      <main className="flex-1 p-8 overflow-y-auto"> {/* Conteúdo principal, com rolagem */}
        <h1 className="text-3xl font-bold mb-6 text-center">Meu Perfil</h1>

        {/* Seção da Foto do Usuário e Nome */}
        <section className="mb-8 flex flex-col items-center">
          <Image 
            src={IMAGEM_PADRAO_USUARIO} // Usando imagem padrão. Se tiver uma URL real do usuário, substitua.
            alt="Foto do usuário" 
            width={150} 
            height={150} 
            className="rounded-full border-4 border-orange-500 mb-4" 
            style={{ objectFit: 'cover' }}
          />
          {loggedInUsername ? (
            <p className="text-gray-700 font-semibold text-xl">{loggedInUsername}</p> // <<< ADICIONADO: Exibe o username
         ) : (
            <p className="text-gray-700 font-semibold text-xl">Carregando nome...</p>
          )}
        </section>

        <hr className="my-8 border-gray-300" />

        {/* Seção de Posts do Usuário */}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6"> {/* Layout de grade */}
            {!loadingPosts && !errorPosts && userPosts.map((post) => (
<Post
  key={post.id}
  id={post.id}
  foto={post.foto}
  description={post.description}
  createdAt={post.createdAt}
  // Não passar 'author' aqui
/>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}