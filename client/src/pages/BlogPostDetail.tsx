import { ArrowLeft, CalendarDays, UserRound } from 'lucide-react';
import { Link, useRoute } from 'wouter';
import { trpc } from '@/lib/trpc';

export default function BlogPostDetail() {
  const [, params] = useRoute('/blog/:slug');
  const slug = params?.slug || '';
  const { data: post, isLoading } = trpc.blog.getBySlug.useQuery(slug, { enabled: Boolean(slug) });

  if (isLoading) {
    return <main className="min-h-screen bg-[#fffaf2] px-4 py-16 text-center text-gray-500">Đang tải bài viết...</main>;
  }

  if (!post) {
    return (
      <main className="min-h-screen bg-[#fffaf2] px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-[#8B1428]">Không tìm thấy bài viết</h1>
        <p className="mt-3 text-gray-600">Bài viết có thể chưa được xuất bản hoặc đường dẫn không chính xác.</p>
        <Link href="/blog" className="mt-6 inline-flex items-center gap-2 font-bold text-[#C41E3A] hover:underline"><ArrowLeft size={16} /> Về danh sách bài viết</Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fffaf2] px-4 py-12">
      <article className="mx-auto max-w-4xl rounded-xl border border-amber-100 bg-white p-6 shadow-sm md:p-10">
        <Link href="/blog" className="mb-8 inline-flex items-center gap-2 font-semibold text-[#C41E3A] hover:underline"><ArrowLeft size={16} /> Tất cả bài viết</Link>
        {post.imageUrl && <img src={post.imageUrl} alt={post.title} className="mb-8 max-h-[420px] w-full rounded-lg object-cover" />}
        <span className="rounded-full bg-amber-50 px-3 py-1 text-sm font-semibold text-[#8B1428]">{post.category}</span>
        <h1 className="mt-4 text-4xl font-bold leading-tight text-[#8B1428]">{post.title}</h1>
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1"><UserRound size={15} /> {post.author}</span>
          <span className="flex items-center gap-1"><CalendarDays size={15} /> {new Date(post.publishedAt).toLocaleDateString('vi-VN')}</span>
        </div>
        {post.excerpt && <p className="mt-8 border-l-4 border-[#D4AF37] pl-4 text-lg italic leading-8 text-gray-700">{post.excerpt}</p>}
        <div className="mt-8 whitespace-pre-wrap text-base leading-8 text-gray-800">{post.content}</div>
      </article>
    </main>
  );
}
