import Image from 'next/image';
import React from 'react';

interface PostProps {
  id: string;
  foto: string;
  description?: string | null;
  createdAt: string;
  author?: {
  id?: string;
  username: string;
};
}

export function Post({ id, foto, description, createdAt, author }: PostProps) {
  const formattedDate = new Date(createdAt).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="w-130 bg-white rounded-lg shadow-md p-4 mb-4 border border-gray-200">

      {author && author.username && (
        <div className="flex items-center mb-3">
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
            style={{ objectFit: 'cover' }}
            className="rounded-md w-"
          />
        </div>
      )}

      {description && (
<p className="text-gray-700 mb-2">
          {description.length > 200 
           ? `${description.substring(0, 200)}...`
           : description
                   }
        </p>
      )}


      <div className="flex justify-between items-center text-gray-600 text-sm mt-2">
      </div>
    </div>
  );
}