import { useMemo, useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Activity,
  CalendarDays,
  ChevronRight,
  Clock3,
  Package,
  RefreshCw,
  ShoppingBag,
  Star,
  TrendingUp,
  Users,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const STATUS_LABELS = {
  pending: 'Chờ xử lý',
  confirmed: 'Đã xác nhận',
  shipped: 'Đang giao',
  delivered: 'Đã giao',
  cancelled: 'Đã hủy',
} as const;

const STATUS_COLORS = ['#D89B12', '#3B82F6', '#6366F1', '#16A34A', '#DC2626'];

function formatCurrency(value: number) {
  return `${Math.round(value).toLocaleString('vi-VN')}₫`;
}

function formatDate(value: string | Date) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString('vi-VN');
}

export default function SaChauDashboard() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const filters = useMemo(() => ({
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  }), [startDate, endDate]);
  const dashboardQuery = trpc.analytics.getDashboard.useQuery(filters);
  const dashboard = dashboardQuery.data;

  const statusData = dashboard
    ? Object.entries(dashboard.statusCounts).map(([status, value]) => ({
      name: STATUS_LABELS[status as keyof typeof STATUS_LABELS] ?? status,
      value,
    }))
    : [];

  return (
    <div className="space-y-6">
      <section className="rounded-2xl p-6 text-white shadow-lg" style={{ background: 'linear-gradient(135deg, #C41E3A 0%, #8B1428 58%, #6E1020 100%)' }}>
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-amber-200">Sa Châu Operations</p>
            <h2 className="text-2xl font-black md:text-3xl">Tổng quan hoạt động kinh doanh</h2>
            <p className="mt-2 max-w-2xl text-sm text-red-100">Theo dõi doanh thu, đơn hàng, khách hàng và sản phẩm bán chạy từ dữ liệu thật trong hệ thống Nước Mắm Cá Vàng.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => dashboardQuery.refetch()}
              className="border-white/60 bg-white/10 text-white hover:bg-white hover:text-[#8B1428]"
              disabled={dashboardQuery.isFetching}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${dashboardQuery.isFetching ? 'animate-spin' : ''}`} />
              Làm mới
            </Button>
          </div>
        </div>
      </section>

      <Card className="border-amber-200 bg-amber-50/50 p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
          <div className="flex items-center gap-2 text-sm font-bold text-[#8B1428] lg:mr-2">
            <CalendarDays className="h-4 w-4" />
            Lọc thời gian
          </div>
          <label className="flex-1 text-sm font-semibold text-slate-700">
            Từ ngày
            <input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} className="mt-1 block w-full rounded-lg border border-amber-200 bg-white px-3 py-2 font-normal outline-none focus:border-[#C41E3A] focus:ring-2 focus:ring-red-100" />
          </label>
          <label className="flex-1 text-sm font-semibold text-slate-700">
            Đến ngày
            <input type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} className="mt-1 block w-full rounded-lg border border-amber-200 bg-white px-3 py-2 font-normal outline-none focus:border-[#C41E3A] focus:ring-2 focus:ring-red-100" />
          </label>
          <Button type="button" variant="outline" onClick={() => { setStartDate(''); setEndDate(''); }} className="border-[#C41E3A] text-[#C41E3A] hover:bg-red-50">
            Xóa lọc
          </Button>
        </div>
        <p className="mt-3 text-xs text-slate-500">Khách mới/cũ được phân loại trong khoảng thời gian đang chọn. Đơn đã hủy không được tính vào doanh thu và sản phẩm bán chạy.</p>
      </Card>

      {dashboardQuery.isLoading ? (
        <Card className="p-10 text-center text-slate-500">Đang tải dữ liệu vận hành...</Card>
      ) : dashboardQuery.isError ? (
        <Card className="border-red-200 bg-red-50 p-6 text-center text-red-700">Không thể tải dữ liệu dashboard. Vui lòng thử làm mới.</Card>
      ) : dashboard ? (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <MetricCard label="Doanh thu" value={formatCurrency(dashboard.summary.totalRevenue)} icon={<TrendingUp />} tone="purple" />
            <MetricCard label="Tổng đơn hàng" value={dashboard.summary.totalOrders.toLocaleString('vi-VN')} icon={<ShoppingBag />} tone="blue" />
            <MetricCard label="Sản phẩm hoạt động" value={`${dashboard.summary.activeProducts}/${dashboard.summary.totalProducts}`} icon={<Package />} tone="teal" />
            <MetricCard label="Khách hàng" value={dashboard.summary.totalCustomers.toLocaleString('vi-VN')} icon={<Users />} tone="orange" detail={`${dashboard.summary.newCustomers} mới · ${dashboard.summary.returningCustomers} quay lại`} />
            <MetricCard label="Đánh giá đã duyệt" value={dashboard.summary.approvedReviews.toLocaleString('vi-VN')} icon={<Star />} tone="rose" detail={dashboard.summary.approvedReviews ? `${dashboard.summary.averageRating}/5 sao` : 'Chưa có đánh giá'} />
          </div>

          <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
            <Card className="p-5 xl:col-span-2">
              <ChartHeader icon={<TrendingUp />} title="Doanh thu theo tháng" subtitle="Chỉ tính đơn trong khoảng thời gian đã chọn" />
              {dashboard.revenueSeries.length ? (
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={dashboard.revenueSeries} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F1E5C5" />
                      <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => `${Math.round(Number(value) / 1000000)}tr`} />
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Line type="monotone" dataKey="revenue" name="Doanh thu" stroke="#C41E3A" strokeWidth={3} dot={{ r: 4, fill: '#D89B12' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : <EmptyChart text="Chưa có dữ liệu doanh thu trong khoảng thời gian này." />}
            </Card>

            <Card className="p-5">
              <ChartHeader icon={<Activity />} title="Trạng thái đơn hàng" subtitle={`${dashboard.summary.totalOrders.toLocaleString('vi-VN')} đơn trong kỳ`} />
              {dashboard.summary.totalOrders ? (
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={58} outerRadius={88} paddingAngle={3}>
                        {statusData.map((entry, index) => <Cell key={entry.name} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />)}
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="bottom" height={40} wrapperStyle={{ fontSize: 12 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : <EmptyChart text="Chưa có đơn hàng trong khoảng thời gian này." />}
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            <Card className="p-5">
              <ChartHeader icon={<Package />} title="Sản phẩm bán chạy" subtitle="Theo số lượng trong đơn không bị hủy" />
              {dashboard.topProducts.length ? (
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dashboard.topProducts.slice(0, 6)} layout="vertical" margin={{ top: 5, right: 20, left: 15, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F1E5C5" />
                      <XAxis type="number" allowDecimals={false} />
                      <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 11 }} />
                      <Tooltip formatter={(value) => `${Number(value).toLocaleString('vi-VN')} sản phẩm`} />
                      <Bar dataKey="salesCount" name="Số lượng bán" fill="#D89B12" radius={[0, 6, 6, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : <EmptyChart text="Chưa có dữ liệu sản phẩm bán ra trong khoảng thời gian này." />}
            </Card>

            <Card className="p-5">
              <ChartHeader icon={<Clock3 />} title="Đơn hàng gần đây" subtitle="Năm đơn mới nhất trong bộ lọc" />
              {dashboard.recentOrders.length ? (
                <div className="space-y-3">
                  {dashboard.recentOrders.map((order: any) => (
                    <div key={order.id} className="flex items-center justify-between gap-3 rounded-xl border border-amber-100 bg-amber-50/40 p-3">
                      <div className="min-w-0">
                        <p className="truncate font-bold text-slate-800">{order.orderNumber}</p>
                        <p className="truncate text-sm text-slate-500">{order.customerName} · {formatDate(order.createdAt)}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-[#C41E3A]">{formatCurrency(Number(order.totalAmount))}</p>
                        <span className="text-xs font-semibold text-slate-600">{STATUS_LABELS[order.status as keyof typeof STATUS_LABELS] ?? order.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : <EmptyChart text="Chưa có đơn hàng để hiển thị." />}
            </Card>
          </div>
        </>
      ) : null}
    </div>
  );
}

function MetricCard({ label, value, icon, tone, detail }: { label: string; value: string; icon: React.ReactNode; tone: string; detail?: string }) {
  const tones: Record<string, string> = {
    purple: 'from-[#6D28D9] to-[#8B5CF6]',
    blue: 'from-[#2563EB] to-[#38BDF8]',
    teal: 'from-[#0F766E] to-[#14B8A6]',
    orange: 'from-[#D97706] to-[#F59E0B]',
    rose: 'from-[#BE123C] to-[#FB7185]',
  };
  return (
    <Card className={`border-0 bg-gradient-to-br ${tones[tone] ?? tones.purple} p-5 text-white shadow-md`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-white/80">{label}</p>
          <p className="mt-2 text-2xl font-black">{value}</p>
          {detail && <p className="mt-1 text-xs text-white/80">{detail}</p>}
        </div>
        <span className="rounded-lg bg-white/15 p-2">{icon}</span>
      </div>
    </Card>
  );
}

function ChartHeader({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) {
  return (
    <div className="mb-4 flex items-start gap-3">
      <span className="rounded-lg bg-red-50 p-2 text-[#C41E3A]">{icon}</span>
      <div>
        <h3 className="font-bold text-slate-800">{title}</h3>
        <p className="text-xs text-slate-500">{subtitle}</p>
      </div>
    </div>
  );
}

function EmptyChart({ text }: { text: string }) {
  return <div className="flex h-72 items-center justify-center rounded-xl border border-dashed border-amber-200 bg-amber-50/30 p-6 text-center text-sm text-slate-500">{text}</div>;
}
