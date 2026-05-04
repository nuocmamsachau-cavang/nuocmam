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
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [newProduct, setNewProduct] = useState({
    categoryId: 0,
    name: '',
    slug: '',
    description: '',
    price: '',
    imageUrl: '',
  });

  const loginMutation = trpc.admin.login.useMutation();
  const { data: productsData } = trpc.products.list.useQuery(undefined, {
    enabled: adminState.isAuthenticated,
  });
  const { data: categoriesData } = trpc.categories.list.useQuery(undefined, {
    enabled: adminState.isAuthenticated,
  });

  useEffect(() => {
    if (productsData) setProducts(productsData);
  }, [productsData]);

  useEffect(() => {
    if (categoriesData) setCategories(categoriesData);
  }, [categoriesData]);

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
              className="w-full text-white font-bold py-3"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? 'Đang đăng nhập...' : 'Đăng Nhập'}
            </Button>
          </form>
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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="products">Sản Phẩm</TabsTrigger>
            <TabsTrigger value="categories">Danh Mục</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
            <TabsTrigger value="domain">Domain</TabsTrigger>
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
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold mb-2">URL Ảnh</label>
                    <Input
                      value={newProduct.imageUrl}
                      onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>
                <Button style={{ backgroundColor: '#C41E3A' }} className="text-white font-bold">
                  <Plus size={20} className="mr-2" />
                  Thêm Sản Phẩm
                </Button>
              </form>
            </Card>

            {/* Products List */}
            <Card className="p-6">
              <h2 style={{ color: '#C41E3A' }} className="text-2xl font-bold mb-6">Danh Sách Sản Phẩm</h2>
              <div className="space-y-4">
                {products.map(product => (
                  <div key={product.id} className="flex justify-between items-center p-4 border rounded-lg hover:shadow-lg transition">
                    <div>
                      <h3 className="font-bold">{product.name}</h3>
                      <p className="text-sm text-gray-600">{parseFloat(product.price).toLocaleString()}₫</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingProduct(product)}
                      >
                        <Edit2 size={16} />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories" className="space-y-6">
            <Card className="p-6">
              <h2 style={{ color: '#C41E3A' }} className="text-2xl font-bold mb-6">Danh Mục Sản Phẩm</h2>
              <div className="space-y-4">
                {categories.map(category => (
                  <div key={category.id} className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <h3 className="font-bold">{category.name}</h3>
                      <p className="text-sm text-gray-600">Thứ tự: {category.displayOrder}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit2 size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
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

          {/* Domain Management Tab */}
          <TabsContent value="domain" className="space-y-6">
            <Card className="p-6">
              <h2 style={{ color: '#C41E3A' }} className="text-2xl font-bold mb-6">Quan Ly Custom Domain</h2>
              <div className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="font-bold text-blue-900 mb-3">Huong Dan Cau Hinh Custom Domain</h3>
                  <p className="text-sm text-blue-800 mb-4">
                    De cau hinh custom domain www.gosa.com.vn, vui long thuc hien cac buoc sau:
                  </p>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
                    <li><strong>Buoc 1:</strong> Dang nhap vao Manus Management UI (click icon panel ben phai)</li>
                    <li><strong>Buoc 2:</strong> Vao Settings → Domains</li>
                    <li><strong>Buoc 3:</strong> Click Add Domain va nhap www.gosa.com.vn</li>
                    <li><strong>Buoc 4:</strong> Sao chep cac DNS records va them vao nha cung cap domain cua ban (Mat Bao)</li>
                    <li><strong>Buoc 5:</strong> Cho 24-48 gio de DNS cap nhat</li>
                  </ol>
                </div>

                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <h3 className="font-bold text-amber-900 mb-3">Cac DNS Records Can Them</h3>
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
                  <h3 className="font-bold text-green-900 mb-3">Ho Tro</h3>
                  <p className="text-sm text-green-800">
                    Neu can ho tro hoac gap su co, vui long lien he qua:
                  </p>
                  <ul className="list-disc list-inside mt-2 text-sm text-green-800">
                    <li>Email: admin@nuocmamcavang.com</li>
                    <li>Facebook: <a href="https://www.facebook.com/nuocmamcavanglangsachau/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Nuoc Mam Ca Vang</a></li>
                    <li>Manus Support: <a href="https://help.manus.im" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">help.manus.im</a></li>
                  </ul>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
