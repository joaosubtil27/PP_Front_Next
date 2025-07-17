// src/components/Post/index.tsx
import Image from 'next/image';
import React from 'react';

// A interface PostProps agora não precisa mais de 'author' se você não for usá-lo
interface PostProps {
  id: string; // O ID do post
  foto: string; // A URL da foto
  description?: string | null; // A descrição (opcional)
  createdAt: string; // Data de criação
  author?: { // <<< ADICIONADO: 'author' agora é opcional
  id?: string; // ID do autor (opcional)
  username: string; // Nome de usuário do autor
};
}

export function Post({ id, foto, description, createdAt, author }: PostProps) { // <<< ADICIONADO: 'author' nas props
  const formattedDate = new Date(createdAt).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="w-130 bg-white rounded-lg shadow-md p-4 mb-4 border border-gray-200">
{/* <<< ADICIONADO: Renderiza o autor APENAS SE 'author' existir e tiver 'username' >>> */}
      {author && author.username && (
        <div className="flex items-center mb-3">
          {/* Aqui você pode colocar a foto de perfil do autor, se tiver */}
          <div className="w-8 h-8 bg-gray-300 rounded-full mr-2"></div>
          <p className="font-semibold text-gray-800">{author.username}</p>
         <span className="text-sm text-gray-500 ml-auto">{formattedDate}</span>
        </div>
      )}
      {foto && (
        <div className="mb-3">
          <Image
            src={foto}
            alt={description || "Post Image"}
            width={600}
            height={400}
            style={{ objectFit: 'cover' }} // Para cobrir o espaço
            className="rounded-md w-"
          />
        </div>
      )}

      {description && (
<p className="text-gray-700 mb-2">
          {description.length > 200 
           ? `${description.substring(0, 200)}...` // Trunca e adiciona "..."
           : description
                   }
        </p>
      )}

      {/* Aqui você pode adicionar botões de like, comentários, etc., se quiser */}
      <div className="flex justify-between items-center text-gray-600 text-sm mt-2">
        {/* Exemplo: <span>Likes: 0</span> */}
        {/* Exemplo: <span>Comentários: 0</span> */}
      </div>
    </div>
  );
}