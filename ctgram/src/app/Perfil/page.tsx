"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { api } from "../../services/api"; // Importe a instância da API
import { AxiosError } from "axios";
import { Post } from "../../components/Post"; // Importe o componente Post
import { Sidebar } from "../../components/Sidebar"; // Importe a Sidebar

// Defina a interface para o tipo de dado que você espera para cada post
interface UserPostData {
  id: string; // post_id no backend mapeia para id no frontend
  foto: string;
  description: string | null;
  createdAt: string; // posted_at no backend mapeia para createdAt no frontend
  username: string; // O backend retorna 'username' diretamente no item do post
}

export default function PerfilPage() {
  // Alteração 1: Imagem padrão agora é um placeholder local para robustez
  const IMAGEM_PADRAO_PLACEHOLDER = "/default-profile.png"; // Certifique-se que esta imagem existe em /public

  // Alteração 2: Novo estado para a URL da foto de perfil
  const [profileImageUrl, setProfileImageUrl] = useState<string>(IMAGEM_PADRAO_PLACEHOLDER);
  const [loadingProfileImage, setLoadingProfileImage] = useState<boolean>(true);
  const [errorProfileImage, setErrorProfileImage] = useState<string | null>(null);

  // Estado para os posts do usuário (existente)
  const [userPosts, setUserPosts] = useState<UserPostData[]>([]);
  const [loadingPosts, setLoadingPosts] = useState<boolean>(true);
  const [errorPosts, setErrorPosts] = useState<string | null>(null);
  const [loggedInUsername, setLoggedInUsername] = useState<string | null>(null);

  // Efeito para buscar os posts do usuário e a foto de perfil ao carregar a página
  useEffect(() => {
    // Leitura do username do localStorage (existente)
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setLoggedInUsername(storedUsername);
    }

    // Alteração 3: Nova função para buscar a foto de perfil do backend
    async function fetchProfileImage() {
      const token = localStorage.getItem('access_token'); // Pega o token para autenticar
      if (!token) {
        setProfileImageUrl(IMAGEM_PADRAO_PLACEHOLDER);
        setErrorProfileImage("Faça login para ver a foto de perfil.");
        setLoadingProfileImage(false);
        return;
      }

      try {
        setLoadingProfileImage(true);
        setErrorProfileImage(null);
        const response = await api.get('/photo'); // Chama o endpoint GET /photo
        
        if (response.data.foto) { // O backend deve retornar { foto: "URL" }
          setProfileImageUrl(response.data.foto);
        } else {
          setProfileImageUrl(IMAGEM_PADRAO_PLACEHOLDER); // Fallback se não tiver foto no DB
        }
      } catch (err) {
        if (err instanceof AxiosError && err.response) {
          const backendMessage = (err.response.data as { message?: string | string[] })?.message;
          setErrorProfileImage(`Erro ao carregar foto: ${Array.isArray(backendMessage) ? backendMessage.join(', ') : backendMessage || "Desconhecido"}`);
        } else {
          setErrorProfileImage(`Erro inesperado ao carregar foto: ${err instanceof Error ? err.message : "Desconhecido"}`);
        }
        setProfileImageUrl(IMAGEM_PADRAO_PLACEHOLDER); // Usa placeholder em caso de erro
      } finally {
        setLoadingProfileImage(false);
      }
    }

    // Função existente para buscar os posts do usuário
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
          setErrorPosts(`Erro ao carregar seus posts: ${Array.isArray(backendMessage) ? backendMessage.join(', ') : backendMessage || "Desconhecido"}`);
        } else {
          setErrorPosts(`Não foi possível carregar seus posts! Erro inesperado: ${err instanceof Error ? err.message : "Desconhecido"}`);
        }
      } finally {
        setLoadingPosts(false);
      }
    }

    // Chamada das funções no useEffect
    fetchProfileImage(); // Alteração 4: Chamar a função para buscar a foto de perfil
    fetchUserPosts(); // Chamada existente para buscar os posts
  }, []); // Roda apenas uma vez ao montar o componente

  return (
    <div className="flex w-screen h-screen"> {/* Layout flexível para Sidebar e conteúdo */}
      <Sidebar /> {/* Inclua a Sidebar */}
      
      <main className="flex-1 p-8 overflow-y-auto"> {/* Conteúdo principal, com rolagem */}
        <h1 className="text-3xl font-bold mb-6 text-center">Meu Perfil</h1>

        {/* Seção da Foto do Usuário e Nome */}
        <section className="mb-8 flex flex-col items-center">
          {/* Alteração 5: Renderização condicional da Imagem */}
          {loadingProfileImage ? (
            <p>Carregando foto de perfil...</p>
          ) : errorProfileImage ? (
            <p className="text-red-500">{errorProfileImage}</p>
          ) : (
            <Image 
              src={profileImageUrl} // AGORA USA A URL DINÂMICA DO ESTADO
              alt="Foto do usuário" 
              width={150} 
              height={150} 
              className="rounded-full border-4 border-orange-500 mb-4" 
              style={{ objectFit: 'cover' }}
            />
          )}
          
          {loggedInUsername ? (
            <p className="text-gray-700 font-semibold text-xl">{loggedInUsername}</p> 
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
                author={{ username: post.username }} // Alteração 6: Passar o username para o componente Post
                // OBSERVAÇÃO: O COMPONENTE POST ESPERA A PROPRIEDADE 'author' COMO UM OBJETO { username: string }
                // Certifique-se de que seu componente Post está atualizado para receber 'username: string' ou 'author: { username: string }'.
                // Se o Post espera 'author', você deve passar: author={{ username: post.username }}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}