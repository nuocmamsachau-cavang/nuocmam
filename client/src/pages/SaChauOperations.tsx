import { useMemo, useState } from 'react';
import { Link } from 'wouter';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Activity,
  BarChart3,
  CalendarDays,
  ChevronRight,
  CircleDollarSign,
  Facebook,
  Gauge,
  Instagram,
  Music2,
  ExternalLink,
  Globe2,
  Menu,
  Package,
  RefreshCw,
  Search,
  ShoppingBag,
  Store,
  Target,
  TrendingUp,
  Truck,
  Users,
  X,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

type ModuleKey = 'overview' | 'sales' | 'ads' | 'analytics';
type OrderFilter = 'all' | 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

const MODULES: Array<{ key: ModuleKey; label: string; icon: typeof Gauge; description: string }> = [
  { key: 'overview', label: 'Tổng quan', icon: Gauge, description: 'KPI vận hành & tăng trưởng' },
  { key: 'sales', label: 'Bán hàng & đơn hàng', icon: ShoppingBag, description: 'Đơn hàng, khách hàng, sản phẩm' },
  { key: 'ads', label: 'Đo lường quảng cáo', icon: Target, description: 'Google, Facebook, TikTok' },
  { key: 'analytics', label: 'Báo cáo & phân tích', icon: BarChart3, description: 'Doanh thu, chi phí, ROAS' },
];

const STATUS_LABELS: Record<OrderFilter, string> = {
  all: 'Tất cả trạng thái',
  pending: 'Chờ xử lý',
  confirmed: 'Đã xác nhận',
  shipped: 'Đang giao',
  delivered: 'Đã giao',
  cancelled: 'Đã hủy',
};

const STATUS_STYLES: Record<Exclude<OrderFilter, 'all'>, string> = {
  pending: 'bg-amber-100 text-amber-800',
  confirmed: 'bg-blue-100 text-blue-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-emerald-100 text-emerald-800',
  cancelled: 'bg-red-100 text-red-800',
};

const CHANNELS = [
  { key: 'google', label: 'Google Ads', description: 'Từ khóa, CPC, chuyển đổi tìm kiếm', icon: Globe2, tone: 'from-blue-600 to-cyan-500' },
  { key: 'facebook', label: 'Facebook Ads', description: 'Chiến dịch, tin nhắn, đơn hàng', icon: Facebook, tone: 'from-indigo-600 to-blue-500' },
  { key: 'tiktok', label: 'TikTok Ads', description: 'Video, lượt xem, CTR, doanh thu', icon: Activity, tone: 'from-slate-900 to-slate-700' },
] as const;

export const PUBLIC_CHANNELS = [
  { label: 'Facebook Page', url: 'https://www.facebook.com/nuocmamcavanglangsachau/', icon: Facebook, tone: 'bg-blue-50 text-blue-700' },
  { label: 'Website bán hàng', url: 'https://gosa.com.vn/', icon: Globe2, tone: 'bg-emerald-50 text-emerald-700' },
  { label: 'Instagram', url: 'https://instagram.com/nuocmamcavang', icon: Instagram, tone: 'bg-pink-50 text-pink-700' },
  { label: 'TikTok', url: 'https://www.tiktok.com/@nuocmamcavang', icon: Music2, tone: 'bg-slate-100 text-slate-800' },
  { label: 'Google Maps', url: 'https://share.google/E2MS6ylUWEiN940B4', icon: Store, tone: 'bg-amber-50 text-amber-700' },
] as const;

function formatCurrency(value: number) {
  return `${Math.round(value).toLocaleString('vi-VN')}₫`;
}

function formatDate(value: string | Date) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString('vi-VN');
}

export default function SaChauOperations() {
  const [adminToken, setAdminToken] = useState(() => localStorage.getItem('adminToken'));
  const loginMutation = trpc.admin.login.useMutation();

  if (!adminToken) {
    return <OperationsLogin loading={loginMutation.isPending} onLogin={async (username: string, password: string) => {
      const result = await loginMutation.mutateAsync({ username, password });
      localStorage.setItem('adminToken', result.token);
      localStorage.setItem('adminUsername', result.admin.username);
      setAdminToken(result.token);
    }} />;
  }
  return <SaChauOperationsWorkspace onLogout={() => setAdminToken(null)} />;
}

function SaChauOperationsWorkspace({ onLogout }: { onLogout: () => void }) {
  const [activeModule, setActiveModule] = useState<ModuleKey>('overview');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [orderFilter, setOrderFilter] = useState<OrderFilter>('all');
  const [orderSearch, setOrderSearch] = useState('');
  const dashboardFilters = useMemo(() => ({
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  }), [startDate, endDate]);
  const dashboardQuery = trpc.analytics.getDashboard.useQuery(dashboardFilters);
  const adsQuery = trpc.analytics.getAds.useQuery(dashboardFilters);
  const ordersQuery = trpc.orders.list.useQuery({ status: orderFilter === 'all' ? undefined : orderFilter }, { enabled: activeModule === 'sales' || activeModule === 'overview' });
  const productsQuery = trpc.products.list.useQuery({ sort: 'salesDesc' }, { enabled: activeModule === 'sales' || activeModule === 'analytics' || activeModule === 'overview' });
  const dashboard = dashboardQuery.data;
  const activeModuleMeta = MODULES.find((module) => module.key === activeModule) ?? MODULES[0];

  const filteredOrders = useMemo(() => {
    const orders = ordersQuery.data ?? [];
    const keyword = orderSearch.trim().toLocaleLowerCase('vi-VN');
    if (!keyword) return orders;
    return orders.filter((order) => `${order.orderNumber} ${order.customerName} ${order.customerPhone}`.toLocaleLowerCase('vi-VN').includes(keyword));
  }, [ordersQuery.data, orderSearch]);

  const navigateTo = (module: ModuleKey) => {
    setActiveModule(module);
    setMobileNavOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] text-slate-900">
      <div className="flex min-h-screen">
        <aside className={`fixed inset-y-0 left-0 z-50 w-72 transform border-r border-slate-200 bg-white transition-transform duration-200 lg:static lg:translate-x-0 ${mobileNavOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex h-full flex-col">
            <div className="border-b border-slate-100 px-6 py-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#C41E3A] to-[#8B1428] text-xl text-white shadow-md">SC</div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#C41E3A]">Sa Châu OS</p>
                    <h1 className="font-black text-slate-900">Nước Mắm Cá Vàng</h1>
                  </div>
                </div>
                <button type="button" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 lg:hidden" onClick={() => setMobileNavOpen(false)} aria-label="Đóng menu"><X className="h-5 w-5" /></button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-6">
              <p className="mb-3 px-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Vận hành kinh doanh</p>
              <nav className="space-y-1">
                {MODULES.map((module) => {
                  const Icon = module.icon;
                  const selected = activeModule === module.key;
                  return (
                    <button key={module.key} type="button" onClick={() => navigateTo(module.key)} className={`group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition ${selected ? 'bg-red-50 text-[#C41E3A] shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}>
                      <span className={`rounded-lg p-2 ${selected ? 'bg-[#C41E3A] text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-white'}`}><Icon className="h-4 w-4" /></span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-bold">{module.label}</span>
                        <span className="block truncate text-[11px] text-slate-400">{module.description}</span>
                      </span>
                      {selected && <ChevronRight className="h-4 w-4" />}
                    </button>
                  );
                })}
              </nav>
              <p className="mb-3 mt-8 px-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Tài khoản & kết nối</p>
              <div className="rounded-xl border border-amber-100 bg-amber-50 p-4">
                <div className="flex items-start gap-3">
                  <Store className="mt-0.5 h-4 w-4 text-[#C41E3A]" />
                  <div>
                    <p className="text-sm font-bold text-slate-800">Kết nối dữ liệu</p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">Các kênh quảng cáo sẽ hiển thị dữ liệu thật sau khi cấp quyền API.</p>
                    <button type="button" onClick={() => navigateTo('ads')} className="mt-3 text-xs font-bold text-[#C41E3A] hover:underline">Xem trạng thái kết nối →</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-t border-slate-100 p-4">
              <Link href="/" className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50">
                <Truck className="h-4 w-4" /> Về website bán hàng
              </Link>
              <button type="button" onClick={() => { localStorage.removeItem('adminToken'); localStorage.removeItem('adminUsername'); onLogout(); }} className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-bold text-slate-500 hover:bg-red-50 hover:text-[#C41E3A]">
                <X className="h-4 w-4" /> Đăng xuất dashboard
              </button>
            </div>
          </div>
        </aside>

        {mobileNavOpen && <button type="button" className="fixed inset-0 z-40 bg-slate-950/30 lg:hidden" onClick={() => setMobileNavOpen(false)} aria-label="Đóng nền menu" />}

        <main className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
            <div className="flex min-h-20 items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-10">
              <div className="flex items-center gap-3">
                <button type="button" className="rounded-xl border border-slate-200 p-2 text-slate-600 lg:hidden" onClick={() => setMobileNavOpen(true)} aria-label="Mở menu"><Menu className="h-5 w-5" /></button>
                <div>
                  <p className="text-xs font-semibold text-slate-400">Sa Châu Operating System / {activeModuleMeta.label}</p>
                  <h2 className="text-xl font-black text-slate-900 sm:text-2xl">{activeModuleMeta.label}</h2>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="hidden rounded-full bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 sm:inline-flex"><span className="mr-2 mt-0.5 h-2 w-2 rounded-full bg-emerald-500" />Hệ thống hoạt động</span>
                <Button type="button" variant="outline" onClick={() => { void dashboardQuery.refetch(); void adsQuery.refetch(); }} className="border-slate-200 text-slate-600" disabled={dashboardQuery.isFetching || adsQuery.isFetching}>
                  <RefreshCw className={`h-4 w-4 sm:mr-2 ${dashboardQuery.isFetching ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">Làm mới</span>
                </Button>
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-[1600px] space-y-6 px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
            {activeModule === 'overview' && <OverviewModule dashboard={dashboard} adOverview={adsQuery.data} startDate={startDate} endDate={endDate} setStartDate={setStartDate} setEndDate={setEndDate} onClear={() => { setStartDate(''); setEndDate(''); }} />}
            {activeModule === 'sales' && <SalesModule orders={filteredOrders} products={productsQuery.data ?? []} orderFilter={orderFilter} setOrderFilter={setOrderFilter} orderSearch={orderSearch} setOrderSearch={setOrderSearch} loading={ordersQuery.isLoading} />}
            {activeModule === 'ads' && <AdsModule adOverview={adsQuery.data} />}
            {activeModule === 'analytics' && <AnalyticsModule dashboard={dashboard} adOverview={adsQuery.data} products={productsQuery.data ?? []} />}
          </div>
        </main>
      </div>
    </div>
  );
}

function OverviewModule({ dashboard, adOverview, startDate, endDate, setStartDate, setEndDate, onClear }: { dashboard: any; adOverview: any; startDate: string; endDate: string; setStartDate: (value: string) => void; setEndDate: (value: string) => void; onClear: () => void }) {
  const chartData = dashboard?.revenueSeries ?? [];
  const adSummary = adOverview?.summary;
  const hasAdData = Boolean(adSummary && adSummary.totalSpend > 0);
  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-gradient-to-br from-[#8B1428] via-[#C41E3A] to-[#E39B21] p-6 text-white shadow-xl sm:p-8">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.25em] text-amber-200">Nước Mắm Sa Châu · Control Center</p>
            <h3 className="mt-3 max-w-2xl text-3xl font-black leading-tight sm:text-4xl">Một nơi để nhìn thấy toàn bộ nhịp vận hành.</h3>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-red-50">Đơn hàng và doanh thu được lấy từ hệ thống bán hàng hiện có. Số liệu quảng cáo chỉ hiển thị sau khi kết nối tài khoản thật, không dùng số mẫu.</p>
          </div>
          <div className="rounded-2xl border border-white/25 bg-white/10 p-4 backdrop-blur">
            <p className="text-xs font-semibold text-red-100">Trạng thái dữ liệu</p>
            <p className="mt-1 text-lg font-black">Đơn hàng: đã kết nối</p>
            <p className="text-sm text-amber-100">Quảng cáo: chờ cấp quyền API</p>
          </div>
        </div>
      </section>

      <Card className="border-slate-200 p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-700 lg:mr-2"><CalendarDays className="h-4 w-4 text-[#C41E3A]" />Khoảng thời gian</div>
          <label className="flex-1 text-xs font-bold text-slate-500">Từ ngày<input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} className="mt-1 block w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-normal text-slate-700 outline-none focus:border-[#C41E3A]" /></label>
          <label className="flex-1 text-xs font-bold text-slate-500">Đến ngày<input type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} className="mt-1 block w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-normal text-slate-700 outline-none focus:border-[#C41E3A]" /></label>
          <Button type="button" variant="outline" onClick={onClear} className="border-[#C41E3A] text-[#C41E3A]">Xóa lọc</Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <KpiCard label="Doanh thu" value={dashboard ? formatCurrency(dashboard.summary.totalRevenue) : 'Đang tải'} icon={<CircleDollarSign />} tone="violet" />
        <KpiCard label="Đơn hàng" value={dashboard ? dashboard.summary.totalOrders.toLocaleString('vi-VN') : 'Đang tải'} icon={<ShoppingBag />} tone="blue" />
        <KpiCard label="Khách hàng" value={dashboard ? dashboard.summary.totalCustomers.toLocaleString('vi-VN') : 'Đang tải'} detail={dashboard ? `${dashboard.summary.newCustomers} mới · ${dashboard.summary.returningCustomers} quay lại` : undefined} icon={<Users />} tone="amber" />
        <KpiCard label="Chi phí quảng cáo" value={hasAdData ? formatCurrency(adSummary.totalSpend) : 'Chưa có dữ liệu'} detail={hasAdData ? 'Đã đồng bộ từ các kênh' : 'Google · Meta · TikTok'} icon={<Target />} tone="slate" />
        <KpiCard label="ROAS tổng" value={hasAdData ? `${adSummary.roas}x` : '—'} detail={hasAdData ? `${adSummary.totalConversions} chuyển đổi` : 'Cần dữ liệu spend & conversion'} icon={<TrendingUp />} tone="rose" />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <Card className="p-5 shadow-sm xl:col-span-2">
          <SectionTitle icon={<TrendingUp />} title="Tăng trưởng doanh thu" subtitle="Dữ liệu đơn hàng thực tế theo tháng" />
          {chartData.length ? <div className="h-80"><ResponsiveContainer width="100%" height="100%"><AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}><defs><linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#C41E3A" stopOpacity={0.22} /><stop offset="95%" stopColor="#C41E3A" stopOpacity={0.02} /></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke="#E8ECF2" /><XAxis dataKey="label" tick={{ fontSize: 12 }} /><YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => `${Math.round(Number(value) / 1000000)}tr`} /><Tooltip formatter={(value) => formatCurrency(Number(value))} /><Area type="monotone" dataKey="revenue" name="Doanh thu" stroke="#C41E3A" strokeWidth={3} fill="url(#revenueFill)" /></AreaChart></ResponsiveContainer></div> : <EmptyState title="Chưa có dữ liệu doanh thu" description="Khi có đơn hàng trong hệ thống, biểu đồ tăng trưởng sẽ xuất hiện ở đây." />}
        </Card>
        <Card className="p-5 shadow-sm">
          <SectionTitle icon={<Target />} title="Hiệu quả quảng cáo" subtitle="So sánh doanh thu với chi phí theo kênh" />
          {adOverview?.byPlatform?.length ? <div className="space-y-3">{adOverview.byPlatform.map((item: any) => <div key={item.platform} className="flex items-center justify-between rounded-xl border border-slate-100 p-3"><div><p className="text-sm font-bold text-slate-700">{platformLabel(item.platform)}</p><p className="text-xs text-slate-500">{item.clicks.toLocaleString('vi-VN')} clicks · {item.conversions.toLocaleString('vi-VN')} chuyển đổi</p></div><div className="text-right"><p className="font-black text-[#C41E3A]">{item.roas}x</p><p className="text-xs text-slate-500">{formatCurrency(item.spend)}</p></div></div>)}</div> : <EmptyState title="Chưa kết nối kênh quảng cáo" description="Cấu hình Google Ads, Facebook Ads và TikTok Ads để bắt đầu tính Spend, Conversion và ROAS." action="Mở Đo lường quảng cáo" />}
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <Card className="p-5 shadow-sm"><SectionTitle icon={<Activity />} title="Đơn hàng gần đây" subtitle="Dữ liệu mới nhất từ hệ thống bán hàng" />{dashboard?.recentOrders?.length ? <div className="space-y-3">{dashboard.recentOrders.map((order: any) => <OrderRow key={order.id} order={order} />)}</div> : <EmptyState title="Chưa có đơn hàng" description="Các đơn hàng phát sinh từ website bán hàng sẽ được hiển thị ở đây." />}</Card>
        <Card className="p-5 shadow-sm"><SectionTitle icon={<Package />} title="Sức khỏe danh mục" subtitle="Tín hiệu cần theo dõi trong vận hành" /><div className="space-y-3"><InsightRow label="Sản phẩm đang hoạt động" value={dashboard ? `${dashboard.summary.activeProducts}/${dashboard.summary.totalProducts}` : '—'} tone="green" /><InsightRow label="Đánh giá đã duyệt" value={dashboard ? String(dashboard.summary.approvedReviews) : '—'} tone="blue" /><InsightRow label="Kết nối Google / Meta / TikTok" value="Chưa kết nối" tone="amber" /></div></Card>
      </div>
    </div>
  );
}

function SalesModule({ orders, products, orderFilter, setOrderFilter, orderSearch, setOrderSearch, loading }: { orders: any[]; products: any[]; orderFilter: OrderFilter; setOrderFilter: (value: OrderFilter) => void; orderSearch: string; setOrderSearch: (value: string) => void; loading: boolean }) {
  return (
    <div className="space-y-6">
      <ModuleIntro eyebrow="BÁN HÀNG" title="Đơn hàng & sản phẩm" description="Theo dõi toàn bộ đơn hàng từ website, trạng thái giao hàng và nhóm sản phẩm đang tạo doanh thu." />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3"><KpiCard label="Đơn hiển thị" value={orders.length.toLocaleString('vi-VN')} icon={<ShoppingBag />} tone="blue" /><KpiCard label="Sản phẩm bán chạy" value={products.slice(0, 3).length.toLocaleString('vi-VN')} icon={<Package />} tone="amber" /><KpiCard label="Nguồn dữ liệu" value="Website" detail="Đồng bộ trực tiếp" icon={<Store />} tone="green" /></div>
      <Card className="p-4 shadow-sm"><div className="flex flex-col gap-3 lg:flex-row"><div className="relative flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={orderSearch} onChange={(event) => setOrderSearch(event.target.value)} placeholder="Tìm theo mã đơn, tên hoặc số điện thoại" className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-[#C41E3A]" /></div><select value={orderFilter} onChange={(event) => setOrderFilter(event.target.value as OrderFilter)} className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#C41E3A]"><option value="all">{STATUS_LABELS.all}</option><option value="pending">{STATUS_LABELS.pending}</option><option value="confirmed">{STATUS_LABELS.confirmed}</option><option value="shipped">{STATUS_LABELS.shipped}</option><option value="delivered">{STATUS_LABELS.delivered}</option><option value="cancelled">{STATUS_LABELS.cancelled}</option></select></div></Card>
      <Card className="overflow-hidden shadow-sm"><div className="border-b border-slate-100 px-5 py-4"><h3 className="font-black text-slate-800">Danh sách đơn hàng</h3><p className="text-xs text-slate-500">{orders.length} kết quả theo bộ lọc hiện tại</p></div>{loading ? <div className="p-10 text-center text-slate-500">Đang tải đơn hàng...</div> : orders.length ? <div className="divide-y divide-slate-100">{orders.map((order) => <OrderRow key={order.id} order={order} expanded />)}</div> : <EmptyState title="Không có đơn hàng phù hợp" description="Thử bỏ bộ lọc trạng thái hoặc thay đổi từ khóa tìm kiếm." />}</Card>
    </div>
  );
}

function AdsModule({ adOverview }: { adOverview: any }) {
  const adSummary = adOverview?.summary;
  const hasAdData = Boolean(adSummary && adSummary.totalSpend > 0);
  return (
    <div className="space-y-6">
      <ModuleIntro eyebrow="ADS INTELLIGENCE" title="Đo lường quảng cáo đa kênh" description="Khu vực tập trung để theo dõi chi phí, lượt nhấp, chuyển đổi và doanh thu từ Google Ads, Facebook Ads và TikTok Ads." />
      <Card className={`${hasAdData ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50'} p-5`}><div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"><div><p className="font-black text-[#8B1428]">{hasAdData ? 'Đã có dữ liệu quảng cáo' : 'Chưa có kết nối quảng cáo'}</p><p className="mt-1 text-sm text-slate-600">{hasAdData ? `${adSummary.totalConversions} chuyển đổi · ${formatCurrency(adSummary.totalSpend)} chi phí · ROAS ${adSummary.roas}x` : 'Giao diện đã sẵn sàng. Để hiển thị dữ liệu thật, cần thêm quyền API hoặc file đồng bộ từ từng nền tảng.'}</p></div><span className="rounded-full bg-white px-3 py-2 text-xs font-bold text-amber-800">Không dùng số liệu mẫu</span></div></Card>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">{CHANNELS.map((channel) => { const Icon = channel.icon; const stats = adOverview?.byPlatform?.find((item: any) => item.platform === channel.key); return <Card key={channel.key} className="overflow-hidden p-0 shadow-sm"><div className={`bg-gradient-to-r ${channel.tone} p-5 text-white`}><div className="flex items-center justify-between"><span className="rounded-xl bg-white/15 p-3"><Icon className="h-6 w-6" /></span><span className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold">{stats ? 'Đã đồng bộ' : 'Chưa kết nối'}</span></div><h3 className="mt-6 text-xl font-black">{channel.label}</h3><p className="mt-1 text-sm text-white/80">{channel.description}</p></div><div className="p-5"><div className="grid grid-cols-2 gap-3 text-center"><MetricPlaceholder label="Chi phí" value={stats ? formatCurrency(stats.spend) : undefined} /><MetricPlaceholder label="Clicks" value={stats ? stats.clicks.toLocaleString('vi-VN') : undefined} /><MetricPlaceholder label="Conversions" value={stats ? stats.conversions.toLocaleString('vi-VN') : undefined} /><MetricPlaceholder label="ROAS" value={stats ? `${stats.roas}x` : undefined} /></div><Button type="button" variant="outline" className="mt-5 w-full border-slate-200 text-slate-600" disabled>{stats ? 'Đã nhận dữ liệu' : 'Chờ cấu hình kết nối'}</Button></div></Card>; })}</div>
      <Card className="p-5 shadow-sm"><SectionTitle icon={<Globe2 />} title="Mô hình dữ liệu sẽ đồng bộ" subtitle="Các trường sẽ được chuẩn hóa về một dashboard duy nhất" /><div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4"><DataPill title="Campaign" text="Tên chiến dịch & nền tảng" /><DataPill title="Spend" text="Chi phí theo ngày" /><DataPill title="Conversion" text="Đơn hàng quy đổi" /><DataPill title="ROAS" text="Doanh thu / chi phí" /></div></Card>
      <Card className="p-5 shadow-sm"><SectionTitle icon={<ExternalLink />} title="Kênh chính thức của Nước Mắm Cá Vàng" subtitle="Liên kết đã đối chiếu từ các nền tảng bạn cung cấp" /><div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">{PUBLIC_CHANNELS.map((channel) => { const Icon = channel.icon; return <a key={channel.label} href={channel.url} target="_blank" rel="noreferrer" className="group flex items-center gap-3 rounded-xl border border-slate-100 p-3 transition hover:-translate-y-0.5 hover:border-[#C41E3A]/30 hover:shadow-sm"><span className={`rounded-lg p-2 ${channel.tone}`}><Icon className="h-4 w-4" /></span><span className="min-w-0 flex-1 truncate text-sm font-bold text-slate-700">{channel.label}</span><ExternalLink className="h-3.5 w-3.5 text-slate-400 transition group-hover:text-[#C41E3A]" /></a>; })}</div><p className="mt-4 text-xs leading-5 text-slate-500">Liên kết kênh công khai có thể mở ngay. Chỉ số quảng cáo, reach và conversion vẫn cần quyền API/Business tương ứng; hệ thống không hiển thị số liệu suy đoán.</p></Card>
    </div>
  );
}

function AnalyticsModule({ dashboard, adOverview, products }: { dashboard: any; adOverview: any; products: any[] }) {
  const adSummary = adOverview?.summary;
  const hasAdData = Boolean(adSummary && adSummary.totalSpend > 0);
  return (
    <div className="space-y-6">
      <ModuleIntro eyebrow="REPORTING" title="Báo cáo & phân tích" description="Tập hợp các chỉ số để trả lời câu hỏi: kênh nào tạo doanh thu, sản phẩm nào bán tốt và chi phí nào đang hiệu quả." />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3"><KpiCard label="Doanh thu thực tế" value={dashboard ? formatCurrency(dashboard.summary.totalRevenue) : '—'} icon={<CircleDollarSign />} tone="violet" /><KpiCard label="Lợi nhuận gộp" value="Chưa cấu hình" detail="Cần giá vốn sản phẩm" icon={<TrendingUp />} tone="green" /><KpiCard label="ROAS tổng" value={hasAdData ? `${adSummary.roas}x` : '—'} detail={hasAdData ? `${formatCurrency(adSummary.totalSpend)} chi phí` : 'Cần dữ liệu từ Ads API'} icon={<Target />} tone="rose" /></div>
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2"><Card className="p-5 shadow-sm"><SectionTitle icon={<BarChart3 />} title="Top sản phẩm theo số lượng bán" subtitle="Đơn hàng không bị hủy" />{products.length ? <div className="space-y-3">{products.slice(0, 8).map((product, index) => <div key={product.id} className="flex items-center gap-3 rounded-xl border border-slate-100 p-3"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-sm font-black text-[#C41E3A]">{index + 1}</span><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold text-slate-800">{product.name}</p><p className="text-xs text-slate-500">{formatCurrency(Number(product.price))}</p></div><span className="text-xs font-bold text-slate-500">{product.salesCount ?? 0} đã bán</span></div>)}</div> : <EmptyState title="Chưa có dữ liệu sản phẩm" description="Sản phẩm sẽ xuất hiện sau khi có đơn hàng hợp lệ." />}</Card><Card className="p-5 shadow-sm"><SectionTitle icon={<Target />} title="ROAS theo kênh" subtitle="Chi phí và chuyển đổi theo dữ liệu đồng bộ" />{adOverview?.byPlatform?.length ? <div className="space-y-3">{adOverview.byPlatform.map((item: any) => <div key={item.platform} className="flex items-center justify-between rounded-xl border border-slate-100 p-3"><span className="text-sm font-bold text-slate-700">{platformLabel(item.platform)}</span><span className="font-black text-[#C41E3A]">{item.roas}x</span></div>)}</div> : <EmptyState title="Chưa đủ dữ liệu để tính ROAS" description="ROAS cần doanh thu quy đổi và chi phí thực tế từ Google, Facebook hoặc TikTok." />}</Card></div>
    </div>
  );
}

function OperationsLogin({ loading, onLogin }: { loading: boolean; onLogin: (username: string, password: string) => Promise<void> }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    try {
      await onLogin(username.trim(), password);
    } catch {
      setError('Thông tin đăng nhập không đúng hoặc tài khoản chưa được kích hoạt.');
    }
  };

  return <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#8B1428] via-[#C41E3A] to-[#E39B21] px-4 py-8"><Card className="w-full max-w-md border-0 p-6 shadow-2xl sm:p-8"><div className="text-center"><div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#C41E3A] to-[#8B1428] text-2xl font-black text-white">SC</div><p className="mt-5 text-xs font-black uppercase tracking-[0.25em] text-[#C41E3A]">Sa Châu Operating System</p><h1 className="mt-2 text-2xl font-black text-slate-900">Đăng nhập trang quản lý</h1><p className="mt-2 text-sm leading-5 text-slate-500">Dữ liệu đơn hàng và quảng cáo chỉ dành cho tài khoản quản trị.</p></div><form onSubmit={submit} className="mt-7 space-y-4"><label className="block text-sm font-bold text-slate-700">Tên đăng nhập<input required value={username} onChange={(event) => setUsername(event.target.value)} className="mt-1.5 block w-full rounded-xl border border-slate-200 px-3 py-3 text-sm font-normal outline-none focus:border-[#C41E3A] focus:ring-2 focus:ring-red-100" autoComplete="username" /></label><label className="block text-sm font-bold text-slate-700">Mật khẩu<input required type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-1.5 block w-full rounded-xl border border-slate-200 px-3 py-3 text-sm font-normal outline-none focus:border-[#C41E3A] focus:ring-2 focus:ring-red-100" autoComplete="current-password" /></label>{error && <p className="rounded-xl bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">{error}</p>}<Button type="submit" className="w-full bg-[#C41E3A] py-6 text-sm font-black hover:bg-[#8B1428]" disabled={loading}>{loading ? 'Đang xác thực…' : 'Đăng nhập dashboard'}</Button></form><p className="mt-5 text-center text-xs leading-5 text-slate-400">Không có tài khoản? Hãy dùng tài khoản quản trị hiện có trong Admin Panel.</p></Card></div>;
}

function ModuleIntro({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return <section className="rounded-3xl bg-white p-6 shadow-sm sm:p-8"><p className="text-xs font-black uppercase tracking-[0.22em] text-[#C41E3A]">{eyebrow}</p><h3 className="mt-2 text-3xl font-black text-slate-900">{title}</h3><p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500">{description}</p></section>;
}

function KpiCard({ label, value, detail, icon, tone }: { label: string; value: string; detail?: string; icon: React.ReactNode; tone: string }) {
  const tones: Record<string, string> = { violet: 'from-violet-600 to-purple-500', blue: 'from-blue-600 to-cyan-500', amber: 'from-amber-500 to-orange-400', slate: 'from-slate-700 to-slate-500', rose: 'from-rose-600 to-pink-500', green: 'from-emerald-600 to-teal-500' };
  return <Card className={`border-0 bg-gradient-to-br ${tones[tone] ?? tones.blue} p-5 text-white shadow-md`}><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-wide text-white/75">{label}</p><p className="mt-2 text-2xl font-black">{value}</p>{detail && <p className="mt-1 text-xs text-white/75">{detail}</p>}</div><span className="rounded-xl bg-white/15 p-2">{icon}</span></div></Card>;
}

function SectionTitle({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) {
  return <div className="mb-5 flex items-start gap-3"><span className="rounded-xl bg-red-50 p-2 text-[#C41E3A]">{icon}</span><div><h3 className="font-black text-slate-800">{title}</h3><p className="text-xs text-slate-500">{subtitle}</p></div></div>;
}

function OrderRow({ order, expanded = false }: { order: any; expanded?: boolean }) {
  const status = order.status as Exclude<OrderFilter, 'all'>;
  return <div className={`flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between ${expanded ? 'hover:bg-slate-50' : ''}`}><div className="flex min-w-0 items-center gap-3"><div className="rounded-xl bg-red-50 p-3 text-[#C41E3A]"><ShoppingBag className="h-4 w-4" /></div><div className="min-w-0"><p className="truncate text-sm font-black text-slate-800">{order.orderNumber}</p><p className="truncate text-xs text-slate-500">{order.customerName} · {order.customerPhone} · {formatDate(order.createdAt)}</p></div></div><div className="flex items-center justify-between gap-4 sm:justify-end"><div className="text-left sm:text-right"><p className="font-black text-[#C41E3A]">{formatCurrency(Number(order.totalAmount))}</p><p className="text-xs text-slate-400">{order.items ? 'Có sản phẩm trong đơn' : 'Chưa có chi tiết'}</p></div><span className={`rounded-full px-3 py-1 text-xs font-bold ${STATUS_STYLES[status] ?? 'bg-slate-100 text-slate-700'}`}>{STATUS_LABELS[status] ?? order.status}</span></div></div>;
}

function EmptyState({ title, description, action }: { title: string; description: string; action?: string }) {
  return <div className="flex min-h-56 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 p-6 text-center"><div className="rounded-full bg-white p-3 text-slate-300 shadow-sm"><BarChart3 className="h-6 w-6" /></div><p className="mt-3 font-bold text-slate-700">{title}</p><p className="mt-1 max-w-sm text-xs leading-5 text-slate-500">{description}</p>{action && <span className="mt-3 text-xs font-bold text-[#C41E3A]">{action} →</span>}</div>;
}

function InsightRow({ label, value, tone }: { label: string; value: string; tone: string }) {
  const toneClass = tone === 'green' ? 'bg-emerald-50 text-emerald-700' : tone === 'blue' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700';
  return <div className="flex items-center justify-between rounded-xl border border-slate-100 p-3"><span className="text-sm text-slate-600">{label}</span><span className={`rounded-full px-3 py-1 text-xs font-bold ${toneClass}`}>{value}</span></div>;
}

function MetricPlaceholder({ label, value }: { label: string; value?: string }) {
  return <div className="rounded-xl bg-slate-50 p-3"><p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">{label}</p><p className={`mt-1 text-lg font-black ${value ? 'text-slate-700' : 'text-slate-300'}`}>{value ?? '—'}</p></div>;
}

function platformLabel(platform: string) {
  return platform === 'google' ? 'Google Ads' : platform === 'facebook' ? 'Facebook Ads' : platform === 'tiktok' ? 'TikTok Ads' : platform;
}

function DataPill({ title, text }: { title: string; text: string }) {
  return <div className="rounded-xl border border-slate-100 bg-slate-50 p-4"><p className="text-sm font-black text-slate-700">{title}</p><p className="mt-1 text-xs leading-5 text-slate-500">{text}</p></div>;
}
