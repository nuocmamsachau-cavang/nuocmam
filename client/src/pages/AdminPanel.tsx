import { useState, useEffect } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogOut, Plus, Edit2, Trash2, Save } from 'lucide-react';

interface AdminState {
  token: string | null;
  username: string;
  isAuthenticated: boolean;
}

export default function AdminPanel() {
  const [adminState, setAdminState] = useState<AdminState>({
    token: localStorage.getItem('adminToken'),
    username: localStorage.getItem('adminUsername') || '',
    isAuthenticated: !!localStorage.getItem('adminToken'),
  });

  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [newProduct, setNewProduct] = useState({
    categoryId: 0,
    name: '',
    slug: '',
    description: '',
    price: '',
    imageUrl: '',
  });

  const [promotions, setPromotions] = useState<any[]>([]);
  const [newPromotion, setNewPromotion] = useState({
    code: '',
    discountPercent: '',
    startDate: '',
    endDate: '',
    description: '',
  });

  const loginMutation = trpc.admin.login.useMutation();
  const { data: productsData } = trpc.products.list.useQuery(undefined, {
    enabled: adminState.isAuthenticated,
  });
  const { data: categoriesData } = trpc.categories.list.useQuery(undefined, {
    enabled: adminState.isAuthenticated,
  });
  const { data: ordersData } = trpc.orders.list.useQuery(undefined, {
    enabled: adminState.isAuthenticated,
  });
  const { data: promotionsData } = trpc.promotions.list.useQuery(undefined, {
    enabled: adminState.isAuthenticated,
  });
  const createPromotionMutation = trpc.promotions.create.useMutation();

  useEffect(() => {
    if (productsData) setProducts(productsData);
  }, [productsData]);

  useEffect(() => {
    if (categoriesData) setCategories(categoriesData);
  }, [categoriesData]);

  useEffect(() => {
    if (ordersData) setOrders(ordersData);
  }, [ordersData]);

  useEffect(() => {
    if (promotionsData) setPromotions(promotionsData);
  }, [promotionsData]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await loginMutation.mutateAsync({
        username: loginForm.username,
        password: loginForm.password,
      });

      localStorage.setItem('adminToken', result.token);
      localStorage.setItem('adminUsername', result.admin.username);

      setAdminState({
        token: result.token,
        username: result.admin.username,
        isAuthenticated: true,
      });

      setLoginForm({ username: '', password: '' });
    } catch (error) {
      alert('Đăng nhập thất bại. Vui lòng kiểm tra tài khoản và mật khẩu.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUsername');
    setAdminState({
      token: null,
      username: '',
      isAuthenticated: false,
    });
  };

  const handleCreatePromotion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPromotion.code || !newPromotion.discountPercent || !newPromotion.startDate || !newPromotion.endDate) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }
    try {
      await createPromotionMutation.mutateAsync({
        code: newPromotion.code,
        discountPercent: parseInt(newPromotion.discountPercent),
        startDate: new Date(newPromotion.startDate),
        endDate: new Date(newPromotion.endDate),
        description: newPromotion.description || '',
      });
      setNewPromotion({ code: '', discountPercent: '', startDate: '', endDate: '', description: '' });
      alert('Tạo khuyến mãi thành công!');
    } catch (error) {
      alert('Lỗi khi tạo khuyến mãi');
      console.error(error);
    }
  };

  if (!adminState.isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FEFDFB' }}>
        <Card className="w-full max-w-md p-8">
          <h1 style={{ color: '#C41E3A' }} className="text-3xl font-bold mb-6 text-center">
            🔐 Admin Panel
          </h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-2">Tên Đăng Nhập</label>
              <Input
                type="text"
                value={loginForm.username}
                onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                placeholder="Nhập tên đăng nhập"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Mật Khẩu</label>
              <Input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                placeholder="Nhập mật khẩu"
                className="w-full"
              />
            </div>
            <Button
              type="submit"
              style={{ backgroundColor: '#C41E3A' }}
              className="w-full text-white font-bold"
            >
              Đăng Nhập
            </Button>
          </form>
          <p className="text-xs text-gray-500 mt-4 text-center">
            Demo: GOSA / nuocmamcavang123
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FEFDFB' }}>
      {/* Header */}
      <header style={{ background: 'linear-gradient(135deg, #C41E3A 0%, #8B1428 100%)' }} className="text-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">🔐 Admin Panel - {adminState.username}</h1>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="text-white border-white hover:bg-white hover:text-red-600"
          >
            <LogOut size={20} className="mr-2" />
            Đăng Xuất
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs defaultValue="products" className="w-full">
          <TabsList className="grid w-full grid-cols-7 mb-6">
            <TabsTrigger value="products">Sản Phẩm</TabsTrigger>
            <TabsTrigger value="categories">Danh Mục</TabsTrigger>
            <TabsTrigger value="orders">Đơn Hàng</TabsTrigger>
            <TabsTrigger value="promotions">Khuyến Mãi</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
            <TabsTrigger value="domain">Domain</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <Card className="p-6">
              <h2 style={{ color: '#C41E3A' }} className="text-2xl font-bold mb-6">Thêm Sản Phẩm Mới</h2>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold mb-2">Danh Mục</label>
                    <select
                      value={newProduct.categoryId}
                      onChange={(e) => setNewProduct({ ...newProduct, categoryId: parseInt(e.target.value) })}
                      className="w-full p-2 border rounded"
                    >
                      <option value="0">Chọn danh mục</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">Tên Sản Phẩm</label>
                    <Input
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      placeholder="Tên sản phẩm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">Slug</label>
                    <Input
                      value={newProduct.slug}
                      onChange={(e) => setNewProduct({ ...newProduct, slug: e.target.value })}
                      placeholder="slug-san-pham"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">Giá (VNĐ)</label>
                    <Input
                      type="number"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold mb-2">Mô Tả</label>
                    <textarea
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                      placeholder="Mô tả sản phẩm"
                      className="w-full p-2 border rounded"
                      rows={3}
                    />
                  </div>
                </div>
                <Button style={{ backgroundColor: '#C41E3A' }} className="text-white font-bold">
                  <Plus size={20} className="mr-2" />
                  Thêm Sản Phẩm
                </Button>
              </form>
            </Card>

            <Card className="p-6">
              <h2 style={{ color: '#C41E3A' }} className="text-2xl font-bold mb-6">Danh Sách Sản Phẩm</h2>
              <div className="space-y-4">
                {products.map(product => (
                  <div key={product.id} className="border p-4 rounded flex justify-between items-center">
                    <div>
                      <h3 className="font-bold">{product.name}</h3>
                      <p className="text-sm text-gray-600">{product.price} VNĐ</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm"><Edit2 size={16} /></Button>
                      <Button variant="outline" size="sm"><Trash2 size={16} /></Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories" className="space-y-6">
            <Card className="p-6">
              <h2 style={{ color: '#C41E3A' }} className="text-2xl font-bold mb-6">Quản Lý Danh Mục</h2>
              <div className="space-y-4">
                {categories.map(cat => (
                  <div key={cat.id} className="border p-4 rounded flex justify-between items-center">
                    <div>
                      <h3 className="font-bold">{cat.name}</h3>
                      <p className="text-sm text-gray-600">{cat.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm"><Edit2 size={16} /></Button>
                      <Button variant="outline" size="sm"><Trash2 size={16} /></Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <Card className="p-6">
              <h2 style={{ color: '#C41E3A' }} className="text-2xl font-bold mb-6">📦 Quản Lý Đơn Hàng</h2>
              <div className="space-y-4">
                {orders && orders.length > 0 ? (
                  orders.map((order: any) => (
                    <div key={order.id} className="border p-4 rounded">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-xs text-gray-500">Mã Đơn</p>
                          <p className="font-bold">{order.orderNumber}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Khách Hàng</p>
                          <p className="font-bold">{order.customerName}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Điện Thoại</p>
                          <p className="font-bold">{order.customerPhone}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Tổng Tiền</p>
                          <p className="font-bold">{order.totalAmount} VNĐ</p>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t">
                        <p className="text-sm text-gray-600"><strong>Địa chỉ:</strong> {order.customerAddress}</p>
                        <p className="text-sm text-gray-600"><strong>Ghi chú:</strong> {order.notes || 'Không có'}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8">Chưa có đơn hàng nào</p>
                )}
              </div>
            </Card>
          </TabsContent>

          {/* Promotions Tab */}
          <TabsContent value="promotions" className="space-y-6">
            <Card className="p-6">
              <h2 style={{ color: '#C41E3A' }} className="text-2xl font-bold mb-6">🎁 Quản Lý Khuyến Mãi</h2>
              <form onSubmit={handleCreatePromotion} className="space-y-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold mb-2">Mã Khuyến Mãi</label>
                    <Input value={newPromotion.code} onChange={(e) => setNewPromotion({...newPromotion, code: e.target.value})} placeholder="VD: SUMMER2024" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">Giảm Giá (%)</label>
                    <Input type="number" value={newPromotion.discountPercent} onChange={(e) => setNewPromotion({...newPromotion, discountPercent: e.target.value})} placeholder="10" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">Ngày Bắt Đầu</label>
                    <Input type="date" value={newPromotion.startDate} onChange={(e) => setNewPromotion({...newPromotion, startDate: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">Ngày Kết Thúc</label>
                    <Input type="date" value={newPromotion.endDate} onChange={(e) => setNewPromotion({...newPromotion, endDate: e.target.value})} />
                  </div>
                </div>
                <Button type="submit" style={{ backgroundColor: '#C41E3A' }} className="text-white font-bold">
                  <Plus size={20} className="mr-2" />
                  Tạo Khuyến Mãi
                </Button>
              </form>
              <div className="border-t pt-4">
                <h3 className="font-bold mb-4">Danh Sách Khuyến Mãi</h3>
                {promotions && promotions.length > 0 ? (
                  <div className="space-y-3">
                    {promotions.map((promo: any) => (
                      <div key={promo.id} className="border p-4 rounded bg-yellow-50">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <div><p className="text-xs text-gray-500">Mã</p><p className="font-bold">{promo.code}</p></div>
                          <div><p className="text-xs text-gray-500">Giảm Giá</p><p className="font-bold">{promo.discountPercent}%</p></div>
                          <div><p className="text-xs text-gray-500">Từ</p><p className="font-bold text-sm">{new Date(promo.startDate).toLocaleDateString('vi-VN')}</p></div>
                          <div><p className="text-xs text-gray-500">Đến</p><p className="font-bold text-sm">{new Date(promo.endDate).toLocaleDateString('vi-VN')}</p></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">Chưa có khuyến mãi nào</p>
                )}
              </div>
            </Card>
          </TabsContent>

          {/* SEO Tab */}
          <TabsContent value="seo" className="space-y-6">
            <Card className="p-6">
              <h2 style={{ color: '#C41E3A' }} className="text-2xl font-bold mb-6">Quản Lý SEO</h2>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-bold mb-2">Loại Trang</label>
                  <select className="w-full p-2 border rounded">
                    <option>home</option>
                    <option>product</option>
                    <option>category</option>
                    <option>about</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Tiêu Đề (Title)</label>
                  <Input placeholder="Nước Mắm Cá Vàng - Tinh Túy Làng Nghề 200 Năm" />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Mô Tả (Meta Description)</label>
                  <textarea
                    placeholder="Nước mắm truyền thống nguyên chất, kết tinh từ nắng gió biển cả..."
                    className="w-full p-2 border rounded"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Từ Khóa (Keywords)</label>
                  <Input placeholder="nước mắm, cá vàng, sa châu, nước mắm truyền thống" />
                </div>
                <Button style={{ backgroundColor: '#C41E3A' }} className="text-white font-bold">
                  <Save size={20} className="mr-2" />
                  Lưu SEO
                </Button>
              </form>
            </Card>
          </TabsContent>

          {/* Domain Tab */}
          <TabsContent value="domain" className="space-y-6">
            <Card className="p-6">
              <h2 style={{ color: '#C41E3A' }} className="text-2xl font-bold mb-6">⚙️ Quản Lý Custom Domain</h2>
              <div className="space-y-6">
                {/* Custom Domain Form */}
                <div className="bg-gradient-to-r from-red-50 to-yellow-50 p-6 rounded-lg border-2 border-red-200">
                  <h3 className="font-bold text-lg mb-4" style={{ color: '#C41E3A' }}>🌐 Thêm Custom Domain</h3>
                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold mb-2">Domain của bạn</label>
                      <div className="flex gap-2">
                        <Input placeholder="VD: www.gosa.com.vn" className="flex-1" />
                        <Button style={{ backgroundColor: '#C41E3A' }} className="text-white font-bold whitespace-nowrap">
                          Thêm Domain
                        </Button>
                      </div>
                      <p className="text-xs text-gray-600 mt-2">💡 Nhập domain của bạn (VD: www.gosa.com.vn hoặc gosa.com.vn)</p>
                    </div>
                  </form>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="font-bold text-blue-900 mb-3">📋 Hướng Dẫn Cấu Hình Custom Domain</h3>
                  <p className="text-sm text-blue-800 mb-4">
                    Để cấu hình custom domain <strong>www.gosa.com.vn</strong>, vui lòng thực hiện các bước sau:
                  </p>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
                    <li><strong>Bước 1:</strong> Đăng nhập vào Manus Management UI (click icon panel bên phải)</li>
                    <li><strong>Bước 2:</strong> Vào Settings → Domains</li>
                    <li><strong>Bước 3:</strong> Click "Add Domain" và nhập www.gosa.com.vn</li>
                    <li><strong>Bước 4:</strong> Sao chép các DNS records và thêm vào nhà cung cấp domain của bạn (Mắt Bão)</li>
                    <li><strong>Bước 5:</strong> Chờ 24-48 giờ để DNS cập nhật</li>
                  </ol>
                </div>

                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <h3 className="font-bold text-amber-900 mb-3">🔗 Các DNS Records Cần Thêm</h3>
                  <div className="space-y-2 text-sm text-amber-800 font-mono">
                    <div className="bg-white p-2 rounded border">
                      <p><strong>Type:</strong> CNAME</p>
                      <p><strong>Name:</strong> www</p>
                      <p><strong>Value:</strong> nuocmampro-fdjnndux.manus.space</p>
                    </div>
                    <div className="bg-white p-2 rounded border">
                      <p><strong>Type:</strong> A</p>
                      <p><strong>Name:</strong> @</p>
                      <p><strong>Value:</strong> 34.126.131.234</p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h3 className="font-bold text-green-900 mb-3">✅ Hỗ Trợ</h3>
                  <p className="text-sm text-green-800">
                    Nếu cần hỗ trợ hoặc gặp sự cố, vui lòng liên hệ qua:
                  </p>
                  <ul className="list-disc list-inside mt-2 text-sm text-green-800">
                    <li>Email: admin@nuocmamcavang.com</li>
                    <li>Facebook: <a href="https://www.facebook.com/nuocmamcavanglangsachau/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Nước Mắm Cá Vàng</a></li>
                    <li>Manus Support: <a href="https://help.manus.im" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">help.manus.im</a></li>
                  </ul>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Email Configuration Tab */}
          <TabsContent value="email" className="space-y-6">
            <Card className="p-6">
              <h2 style={{ color: '#C41E3A' }} className="text-2xl font-bold mb-6">📧 Cấu Hình Email</h2>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold mb-2">SMTP Server</label>
                    <Input placeholder="smtp.gmail.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">SMTP Port</label>
                    <Input type="number" placeholder="587" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">Email Address</label>
                    <Input type="email" placeholder="your-email@gmail.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">Password</label>
                    <Input type="password" placeholder="••••••••" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Email Gửi Đơn Hàng Tới</label>
                  <Input type="email" placeholder="admin@nuocmamcavang.com" />
                </div>
                <Button style={{ backgroundColor: '#C41E3A' }} className="text-white font-bold">
                  <Save size={20} className="mr-2" />
                  Lưu Cấu Hình Email
                </Button>
              </form>
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  💡 <strong>Gợi ý:</strong> Sử dụng Gmail App Password nếu dùng Gmail. Bật "Less secure app access" hoặc tạo App Password từ Google Account.
                </p>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
