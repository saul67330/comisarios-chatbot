'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Heart, MessageCircle, Share2, MapPin, MoreHorizontal } from 'lucide-react';

interface Post {
  id: string;
  created_at: string;
  author_name: string;
  author_avatar_url: string;
  content: string;
  image_url: string;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  event_location: string;
}

export default function MuroPage() {
  const supabase = createClient();
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await supabase
        .from('feed_posts')
        .select('*')
        .order('created_at', { ascending: false });
      setPosts(data || []);
    };
    fetchPosts();
  }, [supabase]);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat('es-MX', { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(d);
  };

  return (
    <div className="max-w-2xl mx-auto w-full px-4 py-8 md:py-12">
      <div className="text-center mb-10 pt-[15vh]">
        <h1 className="font-['Rye'] text-4xl sm:text-5xl md:text-7xl font-bold text-white tracking-tight sm:tracking-widest mb-2 drop-shadow-[0_10px_25px_rgba(0,0,0,1)]">El Muro</h1>
        <p className="font-label text-sm md:text-base uppercase tracking-[0.4em] text-[#D4AF37] font-extrabold drop-shadow-[0_5px_15px_rgba(0,0,0,1)]">Fotos y Noticias Recientes</p>
      </div>

      <div className="space-y-8 pb-20">
        {posts.map((post) => (
          <article key={post.id} className="bg-surface-container-low/60 backdrop-blur-3xl rounded-3xl border border-outline-variant/20 shadow-2xl overflow-hidden flex flex-col relative">
            {/* Header */}
            <div className="p-4 flex justify-between items-center bg-surface-container-highest/20">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-primary/30">
                  <img src={post.author_avatar_url} alt={post.author_name} className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-on-surface text-base">{post.author_name}</span>
                  <div className="flex items-center gap-1 text-xs text-on-surface-variant">
                    <span>{formatDate(post.created_at)}</span>
                    {post.event_location && (
                      <>
                        <span className="px-1">•</span>
                        <MapPin size={10} className="text-primary" />
                        <span>{post.event_location}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <button className="text-on-surface-variant hover:text-primary transition-colors">
                <MoreHorizontal size={20} />
              </button>
            </div>

            {/* Description */}
            <div className="px-5 py-3">
              <p className="text-on-surface text-sm leading-relaxed whitespace-pre-wrap">{post.content}</p>
            </div>

            {/* Image */}
            {post.image_url && (
              <div className="w-full max-h-[600px] bg-black">
                <img src={post.image_url} alt="Post image" className="w-full h-full object-contain max-h-[600px]" loading="lazy" />
              </div>
            )}

            {/* Stats */}
            <div className="px-5 py-3 flex justify-between items-center text-xs text-on-surface-variant border-b border-outline-variant/10">
              <div className="flex items-center gap-1">
                <Heart size={14} className="fill-primary text-primary" />
                <span>{post.likes_count}</span>
              </div>
              <div className="flex gap-3">
                <span>{post.comments_count} comentarios</span>
                <span>{post.shares_count} compartidas</span>
              </div>
            </div>

            {/* Actions */}
            <div className="px-2 py-1 flex justify-between p-2">
              <button className="flex-1 flex justify-center items-center gap-2 py-3 rounded-xl hover:bg-surface-container-highest text-on-surface-variant hover:text-primary transition-colors font-semibold text-sm">
                <Heart size={20} />
                <span>Me Gusta</span>
              </button>
              <button className="flex-1 flex justify-center items-center gap-2 py-3 rounded-xl hover:bg-surface-container-highest text-on-surface-variant hover:text-primary transition-colors font-semibold text-sm">
                <MessageCircle size={20} />
                <span>Comentar</span>
              </button>
              <button className="flex-1 flex justify-center items-center gap-2 py-3 rounded-xl hover:bg-surface-container-highest text-on-surface-variant hover:text-primary transition-colors font-semibold text-sm">
                <Share2 size={20} />
                <span>Compartir</span>
              </button>
            </div>
          </article>
        ))}

        {posts.length === 0 && (
          <div className="text-center p-10 text-on-surface-variant">
            Cargando publicaciones...
          </div>
        )}
      </div>
    </div>
  );
}
