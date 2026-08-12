import { ArrowRight, BookOpen, CalendarDays } from 'lucide-react';
import { Link } from 'wouter';
import { Card } from '@/components/ui/card';
import { trpc } from '@/lib/trpc';
import { filterPublishedPosts } from '@/lib/publicContent';

export default function Blog() {
  const { data: posts = [], isLoading } = trpc.blog.list.useQuery();
  const publicPosts = filterPublishedPosts(posts);

  return (
    <main className="min-h-screen bg-[#fffaf2] px-4 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-[#8B1428]">
              <BookOpen size={16} /> Kiến thức làng nghề
            </p>
            <h1 className="text-4xl font-bold text-[#8B1428] md:text-5xl">Bài Viết Nước Mắm Cá Vàng</h1>
            <p className="mt-3 max-w-2xl text-gray-600">
              Câu chuyện Sa Châu, kinh nghiệm chọn nước mắm và những giá trị truyền thống được gìn giữ qua nhiều thế hệ.
            </p>
          </div>
          <Link href="/" className="font-semibold text-[#C41E3A] hover:underline">← Về Trang Chủ</Link>
        </div>

        {isLoading ? (
          <p className="rounded-lg border border-amber-200 bg-white p-8 text-center text-gray-500">Đang tải bài viết...</p>
        ) : publicPosts.length === 0 ? (
          <div className="rounded-lg border border-amber-200 bg-white p-10 text-center shadow-sm">
            <BookOpen className="mx-auto mb-4 text-[#D4AF37]" size={40} />
            <h2 className="text-xl font-bold text-[#8B1428]">Chưa có bài viết được xuất bản</h2>
            <p className="mt-2 text-gray-600">Các bài viết sau khi được tạo và bật trạng thái xuất bản trong Admin Panel sẽ xuất hiện tại đây.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {publicPosts.map((post) => (
              <Card key={post.id} className="overflow-hidden border-amber-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                {post.imageUrl ? (
                  <img src={post.imageUrl} alt={post.title} className="h-48 w-full object-cover" />
                ) : (
                  <div className="flex h-48 items-center justify-center bg-gradient-to-br from-[#8B1428] to-[#C41E3A] text-5xl text-[#D4AF37]">✦</div>
                )}
                <div className="p-5">
                  <div className="mb-3 flex items-center gap-2 text-xs text-gray-500">
                    <span className="rounded-full bg-amber-50 px-2 py-1 font-semibold text-[#8B1428]">{post.category}</span>
                    <span className="flex items-center gap-1"><CalendarDays size={13} /> {new Date(post.publishedAt).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <h2 className="line-clamp-2 text-xl font-bold text-[#8B1428]">{post.title}</h2>
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-600">{post.excerpt || post.content}</p>
                  <Link href={`/blog/${post.slug}`} className="mt-5 inline-flex items-center gap-2 font-bold text-[#C41E3A] hover:underline">
                    Đọc bài viết <ArrowRight size={16} />
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
