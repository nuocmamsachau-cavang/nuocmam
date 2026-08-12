import { useEffect, useMemo, useState } from 'react';
import { Link } from 'wouter';
import { ArrowRight, BookOpen, CalendarDays, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { trpc } from '@/lib/trpc';

const PAGE_SIZE = 6;

export default function Blog() {
  const [category, setCategory] = useState('all');
  const [page, setPage] = useState(1);
  const queryInput = useMemo(
    () => ({ category: category === 'all' ? undefined : category, page, pageSize: PAGE_SIZE }),
    [category, page],
  );
  const { data: blogData, isLoading } = trpc.blog.list.useQuery(queryInput);
  const posts = blogData?.items ?? [];
  const categories = blogData?.categories ?? [];
  const totalPages = blogData?.totalPages ?? 0;

  useEffect(() => {
    setPage(1);
  }, [category]);

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    setPage(1);
  };

  return (
    <main className="min-h-screen bg-[#fffaf2] px-4 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
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

        <div className="mb-8 flex flex-col gap-3 rounded-xl border border-amber-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 font-semibold text-[#8B1428]">
            <Filter size={18} /> Lọc bài viết theo chủ đề
          </div>
          <label className="flex w-full items-center gap-3 sm:w-auto">
            <span className="sr-only">Danh mục bài viết</span>
            <select
              value={category}
              onChange={(event) => handleCategoryChange(event.target.value)}
              className="w-full rounded-lg border border-amber-200 bg-[#fffaf2] px-4 py-2.5 text-sm font-semibold text-[#8B1428] outline-none transition focus:border-[#C41E3A] focus:ring-2 focus:ring-[#D4AF37]/40 sm:min-w-56"
            >
              <option value="all">Tất cả danh mục</option>
              {categories.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
        </div>

        {isLoading ? (
          <p className="rounded-lg border border-amber-200 bg-white p-8 text-center text-gray-500">Đang tải bài viết...</p>
        ) : posts.length === 0 ? (
          <div className="rounded-lg border border-amber-200 bg-white p-10 text-center shadow-sm">
            <BookOpen className="mx-auto mb-4 text-[#D4AF37]" size={40} />
            <h2 className="text-xl font-bold text-[#8B1428]">
              {category === 'all' ? 'Chưa có bài viết được xuất bản' : 'Chưa có bài viết trong danh mục này'}
            </h2>
            <p className="mt-2 text-gray-600">
              {category === 'all'
                ? 'Các bài viết sau khi được tạo và bật trạng thái xuất bản trong Admin Panel sẽ xuất hiện tại đây.'
                : 'Hãy thử chọn một danh mục khác để tiếp tục khám phá kiến thức làng nghề.'}
            </p>
            {category !== 'all' && (
              <Button onClick={() => handleCategoryChange('all')} className="mt-5 bg-[#D4AF37] font-bold text-[#8B1428] hover:bg-[#c49f2f]">
                Xem tất cả bài viết
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="mb-5 text-sm text-gray-600">
              Hiển thị <strong className="text-[#8B1428]">{posts.length}</strong> trong tổng số <strong className="text-[#8B1428]">{blogData?.total ?? posts.length}</strong> bài viết
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Card key={post.id} className="overflow-hidden border-amber-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                  {post.imageUrl ? (
                    <img src={post.imageUrl} alt={post.title} className="h-48 w-full object-cover" loading="lazy" />
                  ) : (
                    <div className="flex h-48 items-center justify-center bg-gradient-to-br from-[#8B1428] to-[#C41E3A] text-5xl text-[#D4AF37]">✦</div>
                  )}
                  <div className="p-5">
                    <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-gray-500">
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

            {totalPages > 1 && (
              <nav className="mt-10 flex flex-wrap items-center justify-center gap-2" aria-label="Phân trang bài viết">
                <Button
                  variant="outline"
                  aria-label="Trang trước"
                  disabled={page <= 1}
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  className="border-amber-200 text-[#8B1428] disabled:opacity-40"
                >
                  <ChevronLeft size={18} />
                </Button>
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                  <Button
                    key={pageNumber}
                    variant={pageNumber === page ? 'default' : 'outline'}
                    onClick={() => setPage(pageNumber)}
                    className={pageNumber === page ? 'bg-[#C41E3A] text-white hover:bg-[#8B1428]' : 'border-amber-200 text-[#8B1428]'}
                    aria-current={pageNumber === page ? 'page' : undefined}
                  >
                    {pageNumber}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  aria-label="Trang sau"
                  disabled={page >= totalPages}
                  onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                  className="border-amber-200 text-[#8B1428] disabled:opacity-40"
                >
                  <ChevronRight size={18} />
                </Button>
              </nav>
            )}
          </>
        )}
      </div>
    </main>
  );
}
