import { useMemo, useState, useEffect } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Filter, LogOut, Plus, Edit2, Trash2, Save, Loader } from 'lucide-react';

interface AdminState {
  token: string | null;
  username: string;
  isAuthenticated: boolean;
}

function formatDateInput(value: unknown) {
  if (!value) return '';
  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 10);
}

const ORDER_STATUS_LABELS = {
  all: 'Tất cả trạng thái',
  pending: 'Chờ xử lý',
  confirmed: 'Đã xác nhận',
  shipped: 'Đang giao',
  delivered: 'Đã giao',
  cancelled: 'Đã hủy',
} as const;

const ORDER_STATUS_COLORS = {
  pending: 'bg-amber-100 text-amber-800',
  confirmed: 'bg-blue-100 text-blue-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
} as const;

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
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'>('all');
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
  const [editingPromotion, setEditingPromotion] = useState<any>(null);
  const [newPromotion, setNewPromotion] = useState({
    code: '',
    discountPercent: '',
    startDate: '',
    endDate: '',
    description: '',
  });
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [editingBlogPost, setEditingBlogPost] = useState<any>(null);
  const [newBlogPost, setNewBlogPost] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    imageUrl: '',
    author: 'Nước Mắm Cá Vàng',
    category: 'Kiến Thức',
    isPublished: true,
  });
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewFilter, setReviewFilter] = useState<'pending' | 'approved' | 'all'>('pending');
  const [sslLoading, setSslLoading] = useState(false);
  const [sslMessage, setSslMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [productImages, setProductImages] = useState<any[]>([]);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [showEditProductForm, setShowEditProductForm] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishMessage, setPublishMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [sessionId, setSessionId] = useState('');
  const [showSessionIdForm, setShowSessionIdForm] = useState(false);
  const [editProductForm, setEditProductForm] = useState({
    categoryId: 0,
    name: '',
    slug: '',
    description: '',
    price: '',
  });

  const [newProductImages, setNewProductImages] = useState<any[]>([]);
  const [imageUploadFile, setImageUploadFile] = useState<File | null>(null);
    const [imageUploadForm, setImageUploadForm] = useState({
    imageUrl: '',
    displayOrder: 1,
    altText: '',
  });
  const [imageUploadLoading, setImageUploadLoading] = useState(false);

  const [showNewCategoryForm, setShowNewCategoryForm] = useState(false);

  const [newCategory, setNewCategory] = useState({
    name: '',
    slug: '',
    description: '',
    displayOrder: '',
  });

  const loginMutation = trpc.admin.login.useMutation();
  const sslMutation = trpc.domain.activateSSL.useMutation();
  const updateCategoryMutation = trpc.categories.update.useMutation();
  const deleteCategoryMutation = trpc.categories.delete.useMutation();
  const createCategoryMutation = trpc.categories.create.useMutation();
  const { data: productsData } = trpc.products.list.useQuery(undefined, {
    enabled: adminState.isAuthenticated,
  });
  const { data: categoriesData } = trpc.categories.list.useQuery(undefined, {
    enabled: adminState.isAuthenticated,
  });
  const ordersQueryInput = useMemo(
    () => ({ status: orderStatusFilter === 'all' ? undefined : orderStatusFilter }),
    [orderStatusFilter],
  );
  const { data: ordersData } = trpc.orders.list.useQuery(ordersQueryInput, {
    enabled: adminState.isAuthenticated,
  });
  const { data: promotionsData } = trpc.promotions.list.useQuery(undefined, {
    enabled: adminState.isAuthenticated,
  });
  const { data: blogPostsData } = trpc.blog.getAll.useQuery(undefined, {
    enabled: adminState.isAuthenticated,
  });
  const { data: reviewsData } = trpc.reviews.getAll.useQuery(undefined, {
    enabled: adminState.isAuthenticated,
  });
  const createProductMutation = trpc.products.create.useMutation();
  const deleteProductMutation = trpc.products.delete.useMutation();
    const createProductImageMutation = trpc.productImages.upload.useMutation();
  const updateProductImageMutation = trpc.productImages.update.useMutation();
  const deleteProductImageMutation = trpc.productImages.delete.useMutation();
  const updateProductMutation = trpc.products.update.useMutation();
  const { data: productImagesData } = trpc.productImages.getByProductId.useQuery(editingProductId || 0, {
    enabled: !!editingProductId,
  });
  const { data: sessionIdData } = trpc.settings.getSessionId.useQuery();
  const setSessionIdMutation = trpc.settings.setSessionId.useMutation();

;
  const createPromotionMutation = trpc.promotions.create.useMutation();
  const updatePromotionMutation = trpc.promotions.update.useMutation();
  const deletePromotionMutation = trpc.promotions.delete.useMutation();
  const createBlogMutation = trpc.blog.create.useMutation();
  const updateBlogMutation = trpc.blog.update.useMutation();
  const deleteBlogMutation = trpc.blog.delete.useMutation();
  const setReviewApprovalMutation = trpc.reviews.setApproval.useMutation();
  const promotionUtils = trpc.useUtils();

  useEffect(() => {
    if (productsData) setProducts(productsData);
  }, [productsData])
  useEffect(() => {
    if (productImagesData) setProductImages(productImagesData);
  }, [productImagesData]);

;

  useEffect(() => {
    if (categoriesData) setCategories(categoriesData);
  }, [categoriesData]);

  useEffect(() => {
    if (ordersData) setOrders(ordersData);
  }, [ordersData]);

  useEffect(() => {
    if (promotionsData) setPromotions(promotionsData);
  }, [promotionsData]);

  useEffect(() => {
    if (blogPostsData) setBlogPosts(blogPostsData);
  }, [blogPostsData]);

  useEffect(() => {
    if (reviewsData) setReviews(reviewsData);
  }, [reviewsData]);

  useEffect(() => {
    if (sessionIdData?.sessionId) {
      setSessionId(sessionIdData.sessionId);
    }
  }, [sessionIdData]);

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

  const handleSSLActivation = async () => {
    setSslLoading(true);
    setSslMessage(null);
    try {
      const result = await sslMutation.mutateAsync({ domain: 'www.gosa.com.vn' });
      setSslMessage({
        type: 'success',
        text: '✅ SSL certificate activation initiated! Manus sẽ cấp certificate trong 5-10 phút.',
      });
    } catch (error: any) {
      setSslMessage({
        type: 'error',
        text: `❌ Lỗi: ${error?.message || 'Failed to activate SSL'}`,
      });
    } finally {
      setSslLoading(false);
    }
  };

  const handleSaveSessionId = async () => {
    if (!sessionId.trim()) {
      alert('Vui lòng nhập Session ID');
      return;
    }
    try {
      await setSessionIdMutation.mutateAsync({ sessionId });
      alert('Lưu Session ID thành công!');
      setShowSessionIdForm(false);
    } catch (error) {
      alert('Lỗi khi lưu Session ID');
      console.error(error);
    }
  };

  const handlePublishWebsite = async () => {
    setIsPublishing(true);
    try {
      const response = await fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ version: 'latest' }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setPublishMessage({ type: 'success', text: data.message });
        setTimeout(() => setPublishMessage(null), 8000);
      } else {
        setPublishMessage({ type: 'error', text: data.message || 'Lỗi khi publish website. Vui lòng thử lại.' });
      }
    } catch (error) {
      setPublishMessage({ type: 'error', text: 'Lỗi kết nối. Vui lòng thử lại.' });
      console.error('Publish error:', error);
    } finally {
      setIsPublishing(false);
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
      await promotionUtils.promotions.list.invalidate();
      setNewPromotion({ code: '', discountPercent: '', startDate: '', endDate: '', description: '' });
      alert('Tạo khuyến mãi thành công!');
    } catch (error) {
      alert('Lỗi khi tạo khuyến mãi');
      console.error(error);
    }
  };

  const handleUpdatePromotion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPromotion) return;
    try {
      await updatePromotionMutation.mutateAsync({
        id: editingPromotion.id,
        code: editingPromotion.code,
        discountPercent: parseInt(String(editingPromotion.discountPercent)),
        startDate: new Date(editingPromotion.startDate),
        endDate: new Date(editingPromotion.endDate),
        description: editingPromotion.description || '',
        isActive: Boolean(editingPromotion.isActive),
      });
      await promotionUtils.promotions.list.invalidate();
      setEditingPromotion(null);
      alert('Cập nhật khuyến mãi thành công!');
    } catch (error) {
      alert('Lỗi khi cập nhật khuyến mãi');
      console.error(error);
    }
  };

  const handleDeletePromotion = async (id: number) => {
    if (!confirm('Bạn có chắc muốn xóa khuyến mãi này?')) return;
    try {
      await deletePromotionMutation.mutateAsync(id);
      await promotionUtils.promotions.list.invalidate();
      alert('Đã xóa khuyến mãi.');
    } catch (error) {
      alert('Lỗi khi xóa khuyến mãi');
      console.error(error);
    }
  };

  const handleSubmitBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlogPost.title.trim() || !newBlogPost.slug.trim() || !newBlogPost.content.trim()) {
      alert('Vui lòng nhập tiêu đề, slug và nội dung bài viết.');
      return;
    }
    try {
      if (editingBlogPost) {
        await updateBlogMutation.mutateAsync({ id: editingBlogPost.id, ...newBlogPost });
        alert('Cập nhật bài viết thành công!');
      } else {
        await createBlogMutation.mutateAsync(newBlogPost);
        alert('Thêm bài viết thành công!');
      }
      await promotionUtils.blog.getAll.invalidate();
      await promotionUtils.blog.list.invalidate();
      setEditingBlogPost(null);
      setNewBlogPost({ title: '', slug: '', content: '', excerpt: '', imageUrl: '', author: 'Nước Mắm Cá Vàng', category: 'Kiến Thức', isPublished: true });
    } catch (error) {
      alert('Lỗi khi lưu bài viết');
      console.error(error);
    }
  };

  const handleDeleteBlog = async (id: number) => {
    if (!confirm('Bạn có chắc muốn xóa bài viết này?')) return;
    try {
      await deleteBlogMutation.mutateAsync(id);
      await promotionUtils.blog.getAll.invalidate();
      await promotionUtils.blog.list.invalidate();
      alert('Đã xóa bài viết.');
    } catch (error) {
      alert('Lỗi khi xóa bài viết');
      console.error(error);
    }
  };

  const handleReviewApproval = async (id: number, isApproved: boolean) => {
    try {
      await setReviewApprovalMutation.mutateAsync({ id, isApproved });
      setReviews((current) => current.map((review) => review.id === id ? { ...review, isApproved } : review));
      await promotionUtils.reviews.getAll.invalidate();
      alert(isApproved ? 'Đã duyệt đánh giá.' : 'Đã chuyển đánh giá về trạng thái chờ duyệt.');
    } catch (error) {
      alert('Lỗi khi cập nhật trạng thái đánh giá');
      console.error(error);
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.name || !newCategory.slug) {
      alert('Vui lòng điền tên và slug danh mục');
      return;
    }
    try {
      const result = await createCategoryMutation.mutateAsync({
        name: newCategory.name,
        slug: newCategory.slug,
        description: newCategory.description || '',
        displayOrder: parseInt(newCategory.displayOrder) || 0,
      });
      setCategories([...categories, result]);
      setNewCategory({ name: '', slug: '', description: '', displayOrder: '' });
      setShowNewCategoryForm(false);
      alert('Tạo danh mục thành công!');
    } catch (error) {
      alert('Lỗi khi tạo danh mục');
      console.error(error);
    }
  };

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !editingCategory.name || !editingCategory.slug) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }
    try {
      await updateCategoryMutation.mutateAsync({
        id: editingCategory.id,
        name: editingCategory.name,
        slug: editingCategory.slug,
        description: editingCategory.description || '',
        displayOrder: parseInt(editingCategory.displayOrder) || 0,
      });
      setCategories(categories.map(cat => cat.id === editingCategory.id ? editingCategory : cat));
      setEditingCategory(null);
      alert('Cập nhật danh mục thành công!');
    } catch (error) {
      alert('Lỗi khi cập nhật danh mục');
      console.error(error);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!confirm('Bạn chắc chắn muốn xóa danh mục này?')) return;
    try {
      await deleteCategoryMutation.mutateAsync(id);
      setCategories(categories.filter(cat => cat.id !== id));
      alert('Xóa danh mục thành công!');
    } catch (error) {
      alert('Lỗi khi xóa danh mục');
      console.error(error);
    }
  };


  const handleCreateProduct = async () => {
    if (!newProduct.categoryId || !newProduct.name || !newProduct.slug || !newProduct.price) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }
    try {
      const result = await createProductMutation.mutateAsync({
        categoryId: newProduct.categoryId,
        name: newProduct.name,
        slug: newProduct.slug,
        description: newProduct.description,
        price: parseFloat(newProduct.price),
      });
      setProducts([...products, result]);
      setNewProduct({
        categoryId: 0,
        name: '',
        slug: '',
        description: '',
        price: '',
        imageUrl: '',
      });
      alert('Tạo sản phẩm thành công!');
    } catch (error) {
      alert('Lỗi khi tạo sản phẩm');
      console.error(error);
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    if (!confirm('Bạn chắc chắn muốn xóa sản phẩm này? Tất cả ảnh sẽ bị xóa.')) {
      return;
    }
    try {
      await deleteProductMutation.mutateAsync(productId);
      setProducts(products.filter(p => p.id !== productId));
      alert('Xóa sản phẩm thành công!');
    } catch (error) {
      alert('Lỗi khi xóa sản phẩm');
      console.error(error);
    }
  };

  const handleEditProduct = async () => {
    if (!editingProductId || !editProductForm.name || !editProductForm.slug) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }
    try {
      await updateProductMutation.mutateAsync({
        id: editingProductId,
        categoryId: editProductForm.categoryId || undefined,
        name: editProductForm.name,
        slug: editProductForm.slug,
        description: editProductForm.description,
        price: editProductForm.price ? parseFloat(editProductForm.price) : undefined,
      });
      setProducts(products.map(p => p.id === editingProductId ? { ...p, ...editProductForm } : p));
      setShowEditProductForm(false);
      alert('Cập nhật sản phẩm thành công!');
    } catch (error) {
      alert('Lỗi khi cập nhật sản phẩm');
      console.error(error);
    }
  };

  const handleUploadProductImage = async () => {
    if (!editingProductId || !imageUploadFile) {
      alert('Vui lòng chọn file ảnh');
      return;
    }
    
    if (productImages.length >= 3) {
      alert('Đã đạt tối đa 3 ảnh');
      return;
    }
    
    if (imageUploadForm.displayOrder < 1 || imageUploadForm.displayOrder > 3) {
      alert('Thứ tự phải từ 1 đến 3');
      return;
    }
    
    try {
      setImageUploadLoading(true);
      
      // Convert file to base64
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target?.result as string;
        
        const result = await createProductImageMutation.mutateAsync({
          productId: editingProductId,
          imageData: base64,
          displayOrder: imageUploadForm.displayOrder,
          altText: imageUploadForm.altText,
        });
        
        setProductImages([...productImages, result]);
        
        setImageUploadForm({ imageUrl: '', displayOrder: 1, altText: '' });
        setImageUploadFile(null);
        alert('Upload ảnh thành công!');
      };
      reader.readAsDataURL(imageUploadFile);
    } catch (error) {
      alert('Lỗi khi upload ảnh');
      console.error(error);
    } finally {
      setImageUploadLoading(false);
    }
  };

  const handleDeleteProductImage = async (imageId: number) => {
    if (!confirm('Bạn chắc chắn muốn xóa ảnh này?')) return;
    try {
      await deleteProductImageMutation.mutateAsync(imageId);
      setProductImages(productImages.filter(img => img.id !== imageId));
      alert('Xóa ảnh thành công!');
    } catch (error) {
      alert('Lỗi khi xóa ảnh');
      console.error(error);
    }
  };

  const handleUpdateProductImage = async (imageId: number, displayOrder: number, altText: string) => {
    try {
      await updateProductImageMutation.mutateAsync({
        id: imageId,
        displayOrder,
        altText,
      });
      setProductImages(productImages.map(img => 
        img.id === imageId ? { ...img, displayOrder, altText } : img
      ));
      alert('Cập nhật ảnh thành công!');
    } catch (error) {
      alert('Lỗi khi cập nhật ảnh');
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
          <div className="flex gap-3">
            <Button
              onClick={() => setShowSessionIdForm(!showSessionIdForm)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold text-sm"
            >
              ⚙ Cấu Hình Session
            </Button>
            <Button
              onClick={handlePublishWebsite}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold"
              disabled={isPublishing}
            >
              {isPublishing ? (
                <>
                  <Loader size={20} className="mr-2 animate-spin" />
                  Đang Publish...
                </>
              ) : (
                <>📤 Publish Web Ngay</>
              )}
            </Button>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-red-600"
            >
              <LogOut size={20} className="mr-2" />
              Đăng Xuất
            </Button>
          </div>
          {publishMessage && (
            <div className={`p-3 rounded text-sm mt-3 ${
              publishMessage.type === 'success'
                ? 'bg-green-100 text-green-800 border border-green-300'
                : 'bg-red-100 text-red-800 border border-red-300'
            }`}>
              {publishMessage.text}
            </div>
          )}
          {showSessionIdForm && (
            <div className="mt-4 p-4 bg-white rounded border border-gray-300">
              <h3 className="text-black font-bold mb-2">Cấu Hình Session ID</h3>
              <p className="text-black text-sm mb-2">Session ID hiện tại: {sessionId ? sessionId.substring(0, 10) + '...' : 'Chưa đặt'}</p>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Nhập Session ID mới"
                  value={sessionId}
                  onChange={(e) => setSessionId(e.target.value)}
                  className="flex-1 text-black"
                />
                <Button
                  onClick={handleSaveSessionId}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  <Save size={20} className="mr-2" />
                  Lưu
                </Button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs defaultValue="products" className="w-full">
          <TabsList className="grid w-full grid-cols-10 mb-6 text-xs md:text-sm">
            <TabsTrigger value="products">Sản Phẩm</TabsTrigger>
            <TabsTrigger value="categories">Danh Mục</TabsTrigger>
            <TabsTrigger value="orders">Đơn Hàng</TabsTrigger>
            <TabsTrigger value="promotions">Khuyến Mãi</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
            <TabsTrigger value="domain">Domain</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="blog">Bài Viết</TabsTrigger>
            <TabsTrigger value="reviews">Đánh Giá</TabsTrigger>
            <TabsTrigger value="brand">Thương Hiệu</TabsTrigger>
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
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => {
                          setEditingProductId(product.id);
                          setEditProductForm({
                            categoryId: product.categoryId,
                            name: product.name,
                            slug: product.slug,
                            description: product.description,
                            price: product.price.toString(),
                          });
                          setShowEditProductForm(true);
                        }}
                      >
                        <Edit2 size={16} /> Chỉnh Sửa
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => { 
                          setEditingProductId(product.id); 
                          setProductImages([]); 
                          setShowEditProductForm(false);
                        }}
                      >
                        <Edit2 size={16} /> Ảnh
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>


            {/* Edit Product Form */}
            {showEditProductForm && editingProductId && (
              <Card className="p-6 bg-green-50 border-2 border-green-200 mb-6">
                <h2 style={{ color: '#C41E3A' }} className="text-2xl font-bold mb-6">Chỉnh Sửa Sản Phẩm</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold mb-2">Danh Mục</label>
                    <select 
                      value={editProductForm.categoryId}
                      onChange={(e) => setEditProductForm({ ...editProductForm, categoryId: parseInt(e.target.value) })}
                      className="w-full p-2 border rounded"
                    >
                      <option value={0}>Chọn danh mục</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">Tên Sản Phẩm</label>
                    <Input 
                      type="text"
                      value={editProductForm.name}
                      onChange={(e) => setEditProductForm({ ...editProductForm, name: e.target.value })}
                      placeholder="Tên sản phẩm"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">Slug</label>
                    <Input 
                      type="text"
                      value={editProductForm.slug}
                      onChange={(e) => setEditProductForm({ ...editProductForm, slug: e.target.value })}
                      placeholder="slug-san-pham"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">Giá</label>
                    <Input 
                      type="number"
                      value={editProductForm.price}
                      onChange={(e) => setEditProductForm({ ...editProductForm, price: e.target.value })}
                      placeholder="0"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">Mô Tả</label>
                    <textarea 
                      value={editProductForm.description}
                      onChange={(e) => setEditProductForm({ ...editProductForm, description: e.target.value })}
                      placeholder="Mô tả sản phẩm"
                      className="w-full p-2 border rounded"
                      rows={4}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      style={{ backgroundColor: '#C41E3A' }} 
                      className="text-white"
                      onClick={handleEditProduct}
                    >
                      <Save size={16} className="mr-2" />
                      Lưu Thay Đổi
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => setShowEditProductForm(false)}
                    >
                      Hủy
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Product Images Management */}
            {editingProductId && (
              <Card className="p-6 bg-blue-50 border-2 border-blue-200">
                <h2 style={{ color: '#C41E3A' }} className="text-2xl font-bold mb-6">Quản Lý Ảnh Sản Phẩm (Tối Đa 3 Ảnh)</h2>
                <div className="space-y-4">
                  {/* Image Upload Form */}
                  <div className="bg-white p-4 rounded border">
                    <h3 className="font-bold mb-4">Upload Ảnh Sản Phẩm ({productImages.length}/3)</h3>
                    {productImages.length >= 3 && (
                      <div className="bg-red-50 border border-red-200 p-3 rounded mb-4 text-sm text-red-700">
                        ⚠️ Đã đạt tối đa 3 ảnh. Xóa ảnh cũ để thêm ảnh mới.
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold mb-2">Chọn Ảnh</label>
                        <input 
                          type="file"
                          accept="image/*"
                          onChange={(e) => setImageUploadFile(e.target.files?.[0] || null)}
                          className="w-full p-2 border rounded"
                          disabled={productImages.length >= 3}
                        />
                        {imageUploadFile && (
                          <p className="text-sm text-green-600 mt-2">✓ {imageUploadFile.name}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-bold mb-2">Thứ Tự (1, 2, 3)</label>
                        <Input 
                          type="number"
                          min="1"
                          max="3"
                          value={imageUploadForm.displayOrder}
                          onChange={(e) => setImageUploadForm({ ...imageUploadForm, displayOrder: parseInt(e.target.value) })}
                          className="w-full"
                          disabled={productImages.length >= 3}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-bold mb-2">Alt Text (SEO)</label>
                        <Input 
                          type="text"
                          placeholder="Mô tả ảnh cho SEO"
                          value={imageUploadForm.altText}
                          onChange={(e) => setImageUploadForm({ ...imageUploadForm, altText: e.target.value })}
                          className="w-full"
                          disabled={productImages.length >= 3}
                        />
                      </div>
                    </div>
                    <Button 
                      style={{ backgroundColor: '#C41E3A' }} 
                      className="text-white mt-4"
                      onClick={handleUploadProductImage}
                      disabled={productImages.length >= 3 || imageUploadLoading}
                    >
                      {imageUploadLoading ? <Loader size={16} className="mr-2 animate-spin" /> : <Plus size={16} className="mr-2" />}
                      {imageUploadLoading ? 'Đang upload...' : 'Upload Ảnh'}
                    </Button>
                  </div>

                  {/* Images List */}
                  <div className="bg-white p-4 rounded border">
                    <h3 className="font-bold mb-4">Ảnh Hiện Tại ({productImages.length}/3)</h3>
                    <div className="space-y-3">
                      {productImages.length > 0 ? (
                        productImages.sort((a, b) => a.displayOrder - b.displayOrder).map((img) => (
                          <div key={img.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded border">
                            <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center overflow-hidden">
                              <img src={img.imageUrl} alt={img.altText} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-bold">Ảnh #{img.displayOrder}</p>
                              <p className="text-xs text-gray-600">{img.altText || 'Không có mô tả'}</p>
                              <p className="text-xs text-gray-500 mt-1">Key: {img.imageKey}</p>
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                  const newOrder = prompt('Nhập thứ tự mới (1-3):', img.displayOrder.toString());
                                  if (newOrder && parseInt(newOrder) >= 1 && parseInt(newOrder) <= 3) {
                                    handleUpdateProductImage(img.id, parseInt(newOrder), img.altText);
                                  }
                                }}
                              >
                                <Edit2 size={16} />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-red-600"
                                onClick={() => handleDeleteProductImage(img.id)}
                              >
                                <Trash2 size={16} />
                              </Button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-sm">Chưa có ảnh nào. Hãy upload ảnh sản phẩm.</p>
                      )}
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="mt-4" onClick={() => setEditingProductId(null)}>Đóng</Button>
              </Card>
            )}            </Card>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories" className="space-y-6">
            <Card className="p-6">
              <h2 style={{ color: '#C41E3A' }} className="text-2xl font-bold mb-6">Quản Lý Danh Mục</h2>
              
              {/* Add/Edit Category Form */}
              {showNewCategoryForm || editingCategory ? (
                <form onSubmit={editingCategory ? handleUpdateCategory : handleCreateCategory} className="space-y-4 mb-6 p-4 bg-yellow-50 rounded border border-yellow-200">
                  <h3 className="font-bold text-lg">{editingCategory ? 'Sửa Danh Mục' : 'Thêm Danh Mục Mới'}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold mb-2">Tên Danh Mục</label>
                      <Input 
                        value={editingCategory ? editingCategory.name : newCategory.name} 
                        onChange={(e) => editingCategory ? setEditingCategory({...editingCategory, name: e.target.value}) : setNewCategory({...newCategory, name: e.target.value})} 
                        placeholder="VD: Cá Nục"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2">Slug</label>
                      <Input 
                        value={editingCategory ? editingCategory.slug : newCategory.slug} 
                        onChange={(e) => editingCategory ? setEditingCategory({...editingCategory, slug: e.target.value}) : setNewCategory({...newCategory, slug: e.target.value})} 
                        placeholder="ca-luc"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2">Thứ Tự Hiển Thị</label>
                      <Input 
                        type="number"
                        value={editingCategory ? editingCategory.displayOrder : newCategory.displayOrder} 
                        onChange={(e) => editingCategory ? setEditingCategory({...editingCategory, displayOrder: e.target.value}) : setNewCategory({...newCategory, displayOrder: e.target.value})} 
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2">Mô Tả (Tùy Chọn)</label>
                      <Input 
                        value={editingCategory ? editingCategory.description : newCategory.description} 
                        onChange={(e) => editingCategory ? setEditingCategory({...editingCategory, description: e.target.value}) : setNewCategory({...newCategory, description: e.target.value})} 
                        placeholder="Mô tả danh mục"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" style={{ backgroundColor: '#C41E3A' }} className="text-white">{editingCategory ? 'Cập Nhật' : 'Thêm'}</Button>
                    <Button type="button" variant="outline" onClick={() => {setShowNewCategoryForm(false); setEditingCategory(null);}}>Hủy</Button>
                  </div>
                </form>
              ) : (
                <Button style={{ backgroundColor: '#C41E3A' }} className="text-white mb-4" onClick={() => setShowNewCategoryForm(true)}>
                  <Plus size={16} className="mr-2" /> Thêm Danh Mục Mới
                </Button>
              )}
              
              {/* Categories List */}
              <div className="space-y-4">
                {categories.map(cat => (
                  <div key={cat.id} className="border p-4 rounded flex justify-between items-center hover:bg-gray-50">
                    <div>
                      <h3 className="font-bold">{cat.name}</h3>
                      <p className="text-sm text-gray-600">Slug: {cat.slug}</p>
                      {cat.description && <p className="text-sm text-gray-600">{cat.description}</p>}
                      <p className="text-xs text-gray-500">Thứ tự: {cat.displayOrder}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setEditingCategory(cat)}><Edit2 size={16} /></Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeleteCategory(cat.id)}><Trash2 size={16} /></Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <Card className="p-6">
              <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 style={{ color: '#C41E3A' }} className="text-2xl font-bold">📦 Quản Lý Đơn Hàng</h2>
                  <p className="mt-1 text-sm text-gray-600">Đang hiển thị {orders.length} đơn hàng theo bộ lọc.</p>
                </div>
                <label className="flex items-center gap-2 text-sm font-semibold text-[#8B1428]">
                  <Filter size={17} />
                  <span className="sr-only">Lọc theo trạng thái đơn hàng</span>
                  <select
                    value={orderStatusFilter}
                    onChange={(event) => setOrderStatusFilter(event.target.value as typeof orderStatusFilter)}
                    className="rounded-lg border border-amber-200 bg-[#fffaf2] px-3 py-2.5 text-sm font-semibold outline-none transition focus:border-[#C41E3A] focus:ring-2 focus:ring-[#D4AF37]/40"
                  >
                    {Object.entries(ORDER_STATUS_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="space-y-4">
                {orders.length > 0 ? (
                  orders.map((order: any) => {
                    const status = (order.status || 'pending') as keyof typeof ORDER_STATUS_COLORS;
                    return (
                      <div key={order.id} className="rounded-lg border border-amber-100 bg-white p-4 shadow-sm">
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
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
                          <div>
                            <p className="mb-1 text-xs text-gray-500">Trạng Thái</p>
                            <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${ORDER_STATUS_COLORS[status] || ORDER_STATUS_COLORS.pending}`}>
                              {ORDER_STATUS_LABELS[status] || ORDER_STATUS_LABELS.pending}
                            </span>
                          </div>
                        </div>
                        <div className="mt-3 border-t pt-3">
                          <p className="text-sm text-gray-600"><strong>Địa chỉ:</strong> {order.customerAddress}</p>
                          <p className="text-sm text-gray-600"><strong>Ghi chú:</strong> {order.notes || 'Không có'}</p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="rounded-lg border border-dashed border-amber-300 bg-amber-50/50 px-4 py-10 text-center">
                    <Filter className="mx-auto mb-3 text-[#D4AF37]" size={30} />
                    <p className="font-semibold text-[#8B1428]">
                      {orderStatusFilter === 'all' ? 'Chưa có đơn hàng nào' : `Chưa có đơn hàng ở trạng thái “${ORDER_STATUS_LABELS[orderStatusFilter]}”`}
                    </p>
                    {orderStatusFilter !== 'all' && (
                      <Button variant="outline" onClick={() => setOrderStatusFilter('all')} className="mt-4 border-amber-300 text-[#8B1428] hover:bg-amber-100">
                        Xem tất cả đơn hàng
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>

          {/* Promotions Tab */}
          <TabsContent value="promotions" className="space-y-6">
            <Card className="p-6">
              <h2 style={{ color: '#C41E3A' }} className="text-2xl font-bold mb-2">🎁 Quản Lý Khuyến Mãi</h2>
              <p className="mb-6 text-sm text-gray-600">Ưu đãi đang trong khoảng ngày hiệu lực sẽ tự động hiển thị trên Trang Chủ.</p>
              <form onSubmit={editingPromotion ? handleUpdatePromotion : handleCreatePromotion} className="mb-6 space-y-4 rounded border border-amber-200 bg-amber-50 p-4">
                <h3 className="font-bold">{editingPromotion ? 'Chỉnh Sửa Khuyến Mãi' : 'Tạo Khuyến Mãi Mới'}</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-bold">Mã Khuyến Mãi</label>
                    <Input value={editingPromotion ? editingPromotion.code : newPromotion.code} onChange={(e) => editingPromotion ? setEditingPromotion({ ...editingPromotion, code: e.target.value }) : setNewPromotion({ ...newPromotion, code: e.target.value })} placeholder="VD: SA-20" />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-bold">Giảm Giá (%)</label>
                    <Input type="number" min="1" max="100" value={editingPromotion ? editingPromotion.discountPercent : newPromotion.discountPercent} onChange={(e) => editingPromotion ? setEditingPromotion({ ...editingPromotion, discountPercent: e.target.value }) : setNewPromotion({ ...newPromotion, discountPercent: e.target.value })} placeholder="20" />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-bold">Ngày Bắt Đầu</label>
                    <Input type="date" value={formatDateInput(editingPromotion ? editingPromotion.startDate : newPromotion.startDate)} onChange={(e) => editingPromotion ? setEditingPromotion({ ...editingPromotion, startDate: e.target.value }) : setNewPromotion({ ...newPromotion, startDate: e.target.value })} />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-bold">Ngày Kết Thúc</label>
                    <Input type="date" value={formatDateInput(editingPromotion ? editingPromotion.endDate : newPromotion.endDate)} onChange={(e) => editingPromotion ? setEditingPromotion({ ...editingPromotion, endDate: e.target.value }) : setNewPromotion({ ...newPromotion, endDate: e.target.value })} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-bold">Mô Tả Hiển Thị</label>
                    <Input value={editingPromotion ? (editingPromotion.description || '') : newPromotion.description} onChange={(e) => editingPromotion ? setEditingPromotion({ ...editingPromotion, description: e.target.value }) : setNewPromotion({ ...newPromotion, description: e.target.value })} placeholder="Giảm 20% cho đơn từ 500.000đ" />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button type="submit" style={{ backgroundColor: '#C41E3A' }} className="font-bold text-white"><Save size={18} className="mr-2" />{editingPromotion ? 'Lưu Thay Đổi' : 'Tạo Khuyến Mãi'}</Button>
                  {editingPromotion && <Button type="button" variant="outline" onClick={() => setEditingPromotion(null)}>Hủy Chỉnh Sửa</Button>}
                </div>
              </form>
              <div className="border-t pt-4">
                <h3 className="mb-4 font-bold">Danh Sách Khuyến Mãi</h3>
                {promotions.length > 0 ? (
                  <div className="space-y-3">
                    {promotions.map((promo: any) => (
                      <div key={promo.id} className="rounded border bg-yellow-50 p-4">
                        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
                          <div><p className="text-xs text-gray-500">Mã</p><p className="font-bold">{promo.code}</p></div>
                          <div><p className="text-xs text-gray-500">Giảm Giá</p><p className="font-bold">{promo.discountPercent}%</p></div>
                          <div><p className="text-xs text-gray-500">Từ</p><p className="text-sm font-bold">{new Date(promo.startDate).toLocaleDateString('vi-VN')}</p></div>
                          <div><p className="text-xs text-gray-500">Đến</p><p className="text-sm font-bold">{new Date(promo.endDate).toLocaleDateString('vi-VN')}</p></div>
                          <div><p className="text-xs text-gray-500">Trạng Thái</p><p className={`font-bold ${promo.isActive ? 'text-green-700' : 'text-gray-500'}`}>{promo.isActive ? 'Đang bật' : 'Đã tắt'}</p></div>
                        </div>
                        <p className="mt-3 text-sm text-gray-700">{promo.description || `Nhập mã ${promo.code} để nhận ưu đãi ${promo.discountPercent}%`}</p>
                        <div className="mt-3 flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => setEditingPromotion({ ...promo })}><Edit2 size={15} className="mr-1" /> Sửa</Button>
                          <Button size="sm" variant="outline" className="text-red-600" onClick={() => handleDeletePromotion(promo.id)}><Trash2 size={15} className="mr-1" /> Xóa</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="py-8 text-center text-gray-500">Chưa có khuyến mãi nào. Hãy tạo ưu đãi đầu tiên.</p>
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

                <div className="bg-purple-50 p-6 rounded-lg border-2 border-purple-200">
                  <h3 className="font-bold text-purple-900 mb-4" style={{ color: '#8B1428' }}>🔐 Kích Hoạt SSL Certificate</h3>
                  <p className="text-sm text-purple-800 mb-4">
                    Nếu DNS đã được cấu hình nhưng website vẫn báo lỗi SSL, hãy click nút dưới để Manus tự động cấp SSL certificate cho domain của bạn:
                  </p>
                  <div className="space-y-3">
                    <div className="bg-white p-3 rounded border border-purple-200">
                      <p className="text-sm font-mono text-purple-900">Domain: www.gosa.com.vn</p>
                      <p className="text-xs text-purple-700 mt-1">Status: <span className="font-bold">Chờ SSL Certificate</span></p>
                    </div>
                    <Button
                      onClick={handleSSLActivation}
                      disabled={sslLoading}
                      style={{ backgroundColor: sslLoading ? '#ccc' : '#8B1428' }}
                      className="text-white font-bold w-full flex items-center justify-center gap-2"
                    >
                      {sslLoading ? (
                        <>
                          <Loader className="w-4 h-4 animate-spin" />
                          Đang xử lý...
                        </>
                      ) : (
                        '🔒 Kích Hoạt SSL Certificate Ngay'
                      )}
                    </Button>
                    {sslMessage && (
                      <div className={`p-3 rounded text-sm ${
                        sslMessage.type === 'success'
                          ? 'bg-green-100 text-green-800 border border-green-300'
                          : 'bg-red-100 text-red-800 border border-red-300'
                      }`}>
                        {sslMessage.text}
                      </div>
                    )}
                    <p className="text-xs text-purple-700">
                      💡 Sau khi click, Manus sẽ cấp SSL certificate (Let's Encrypt) trong 5-10 phút. Website sẽ hoạt động bình thường!
                    </p>
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

          {/* Blog Management Tab */}
          <TabsContent value="blog" className="space-y-6">
            <Card className="p-6">
              <h3 className="mb-2 text-xl font-bold" style={{ color: '#C41E3A' }}>Quản Lý Bài Viết</h3>
              <p className="mb-5 text-sm text-gray-600">Bài viết được bật xuất bản sẽ xuất hiện tại <strong>/blog</strong> trên website công khai.</p>
              <form onSubmit={handleSubmitBlog} className="space-y-4 rounded border border-amber-200 bg-amber-50 p-4">
                <h4 className="font-bold">{editingBlogPost ? 'Chỉnh Sửa Bài Viết' : 'Thêm Bài Viết Mới'}</h4>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-bold">Tiêu Đề *</label>
                    <Input value={newBlogPost.title} onChange={(e) => setNewBlogPost({ ...newBlogPost, title: e.target.value })} placeholder="Tiêu đề bài viết" />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-bold">Slug *</label>
                    <Input value={newBlogPost.slug} onChange={(e) => setNewBlogPost({ ...newBlogPost, slug: e.target.value })} placeholder="slug-bai-viet" />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-bold">Danh Mục</label>
                    <Input value={newBlogPost.category} onChange={(e) => setNewBlogPost({ ...newBlogPost, category: e.target.value })} placeholder="Kiến Thức" />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-bold">Tác Giả</label>
                    <Input value={newBlogPost.author} onChange={(e) => setNewBlogPost({ ...newBlogPost, author: e.target.value })} placeholder="Nước Mắm Cá Vàng" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-bold">Ảnh đại diện URL (tùy chọn)</label>
                    <Input value={newBlogPost.imageUrl} onChange={(e) => setNewBlogPost({ ...newBlogPost, imageUrl: e.target.value })} placeholder="/manus-storage/..." />
                  </div>
                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-bold">Tóm Tắt</label>
                    <textarea value={newBlogPost.excerpt} onChange={(e) => setNewBlogPost({ ...newBlogPost, excerpt: e.target.value })} className="w-full rounded border p-2" rows={2} placeholder="Tóm tắt ngắn cho thẻ bài viết" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-bold">Nội Dung *</label>
                    <textarea value={newBlogPost.content} onChange={(e) => setNewBlogPost({ ...newBlogPost, content: e.target.value })} className="w-full rounded border p-2" rows={8} placeholder="Nội dung bài viết..." />
                  </div>
                </div>
                <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={newBlogPost.isPublished} onChange={(e) => setNewBlogPost({ ...newBlogPost, isPublished: e.target.checked })} /> Xuất bản ngay trên website</label>
                <div className="flex flex-wrap gap-2">
                  <Button type="submit" style={{ backgroundColor: '#C41E3A' }} className="font-bold text-white"><Save size={18} className="mr-2" />{editingBlogPost ? 'Lưu Thay Đổi' : 'Thêm Bài Viết'}</Button>
                  {editingBlogPost && <Button type="button" variant="outline" onClick={() => { setEditingBlogPost(null); setNewBlogPost({ title: '', slug: '', content: '', excerpt: '', imageUrl: '', author: 'Nước Mắm Cá Vàng', category: 'Kiến Thức', isPublished: true }); }}>Hủy Chỉnh Sửa</Button>}
                </div>
              </form>
              <div className="mt-6">
                <h4 className="mb-3 font-bold">Danh Sách Bài Viết</h4>
                {blogPosts.length === 0 ? <p className="rounded bg-gray-50 p-6 text-center text-gray-500">Chưa có bài viết nào.</p> : <div className="space-y-3">{blogPosts.map((post) => <div key={post.id} className="rounded border p-4"><div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between"><div><p className="font-semibold text-[#8B1428]">{post.title}</p><p className="text-sm text-gray-600">/{post.slug} · {post.category} · {post.isPublished ? 'Đã xuất bản' : 'Bản nháp'}</p><p className="mt-1 line-clamp-2 text-sm text-gray-600">{post.excerpt || post.content}</p></div><div className="flex gap-2"><Button size="sm" variant="outline" onClick={() => { setEditingBlogPost(post); setNewBlogPost({ title: post.title, slug: post.slug, content: post.content, excerpt: post.excerpt || '', imageUrl: post.imageUrl || '', author: post.author || 'Nước Mắm Cá Vàng', category: post.category || 'Kiến Thức', isPublished: Boolean(post.isPublished) }); }}><Edit2 size={15} /></Button><Button size="sm" variant="outline" className="text-red-600" onClick={() => handleDeleteBlog(post.id)}><Trash2 size={15} /></Button></div></div></div>)}</div>}
              </div>
            </Card>
          </TabsContent>

          {/* Reviews Management Tab */}
          <TabsContent value="reviews" className="space-y-6">
            <Card className="p-6">
              <h3 className="mb-2 text-xl font-bold" style={{ color: '#C41E3A' }}>Quản Lý Đánh Giá Sản Phẩm</h3>
              <p className="mb-5 text-sm text-gray-600">Chỉ đánh giá được duyệt mới xuất hiện công khai trên trang chi tiết sản phẩm.</p>
              <div className="mb-5 flex flex-wrap gap-2">
                {(['pending', 'approved', 'all'] as const).map((filter) => <Button key={filter} type="button" onClick={() => setReviewFilter(filter)} variant={reviewFilter === filter ? 'default' : 'outline'} style={reviewFilter === filter ? { backgroundColor: '#C41E3A' } : undefined} className={reviewFilter === filter ? 'text-white' : ''}>{filter === 'pending' ? 'Chờ Duyệt' : filter === 'approved' ? 'Đã Duyệt' : 'Tất Cả'}</Button>)}
              </div>
              <div className="space-y-3">
                {reviews.filter((review) => reviewFilter === 'all' || (reviewFilter === 'approved' ? review.isApproved : !review.isApproved)).length === 0 ? <p className="rounded bg-gray-50 p-6 text-center text-gray-500">Chưa có đánh giá trong trạng thái này.</p> : reviews.filter((review) => reviewFilter === 'all' || (reviewFilter === 'approved' ? review.isApproved : !review.isApproved)).map((review) => <div key={review.id} className="rounded-lg border p-4"><div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between"><div><p className="font-bold">{review.title}</p><p className="text-sm text-gray-600">Người gửi: {review.customerName} · Sản phẩm ID: {review.productId}</p><div className="text-[#D4AF37]" aria-label={`${review.rating} trên 5 sao`}>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</div></div><p className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString('vi-VN')}</p></div><p className="mt-3 text-sm leading-6 text-gray-700">{review.content}</p><div className="mt-3 flex gap-2">{!review.isApproved && <Button size="sm" style={{ backgroundColor: '#C41E3A' }} className="text-white" onClick={() => handleReviewApproval(review.id, true)}>Duyệt</Button>}{review.isApproved && <Button size="sm" variant="outline" onClick={() => handleReviewApproval(review.id, false)}>Gỡ duyệt</Button>}</div></div>)}
              </div>
            </Card>
          </TabsContent>

          {/* Brand Library / Media Tab */}
          <TabsContent value="brand" className="space-y-6">
            <Card className="p-6">
              <h2 style={{ color: '#C41E3A' }} className="text-2xl font-bold mb-2">🎨 Thư Viện Thương Hiệu & Nhận Diện (Brand Library)</h2>
              <p className="text-sm text-gray-600 mb-2">Quản lý trực tiếp logo mascot, logo ngang, favicon và banner quảng cáo mà không cần can thiệp mã nguồn.</p>
              <p className="text-xs text-gray-500 mb-6">Ảnh tải lên được lưu thành URL storage ổn định, tối đa 8MB. Sau khi lưu, tài sản sẽ được dùng trên website công khai ở đúng vị trí tương ứng.</p>
              
              <BrandAssetManager />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}


function BrandAssetManager() {
  const { data: brandAssets, refetch } = trpc.brand.get.useQuery();
  const updateBrandMutation = trpc.brand.update.useMutation();
  const uploadBrandMutation = trpc.brand.upload.useMutation();
  const brandUtils = trpc.useUtils();

  const [assets, setAssets] = useState<{ [key: string]: { value: string; description?: string } }>({});
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);

  useEffect(() => {
    if (brandAssets) {
      const map: { [key: string]: { value: string; description?: string } } = {};
      Object.entries(brandAssets).forEach(([k, v]) => {
        map[k] = { value: v as string };
      });
      setAssets(map);
    }
  }, [brandAssets]);

  const handleUpdate = async (key: string, value: string, description?: string) => {
    try {
      await updateBrandMutation.mutateAsync({ key, value, description });
      await brandUtils.brand.get.invalidate();
      alert('Đã cập nhật tài sản thương hiệu thành công!');
      await refetch();
    } catch (err) {
      alert('Lỗi khi cập nhật tài sản thương hiệu');
    }
  };

  const handleFileChange = async (key: string, e: React.ChangeEvent<HTMLInputElement>, desc?: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      alert('Ảnh thương hiệu không được vượt quá 8MB');
      e.target.value = '';
      return;
    }

    setUploadingKey(key);
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const imageData = reader.result as string;
        const result = await uploadBrandMutation.mutateAsync({
          key: key as 'brand_mascot_logo' | 'brand_horizontal_logo' | 'brand_favicon' | 'brand_hero_banner',
          imageData,
          mimeType: file.type || 'image/jpeg',
          description: desc,
        });
        setAssets(prev => ({
          ...prev,
          [key]: { value: result.url, description: desc },
        }));
        await brandUtils.brand.get.invalidate();
        await refetch();
        alert('Đã tải ảnh lên storage và cập nhật website thành công!');
      } catch (err) {
        alert('Lỗi tải ảnh thương hiệu lên storage. Vui lòng thử lại.');
      } finally {
        setUploadingKey(null);
        e.target.value = '';
      }
    };
    reader.onerror = () => {
      alert('Không thể đọc tệp ảnh');
      setUploadingKey(null);
      e.target.value = '';
    };
    reader.readAsDataURL(file);
  };

  const defaultKeys = [
    { key: 'brand_mascot_logo', title: 'Logo Mascot (Tròn / Biểu Tượng)', desc: 'Hiển thị ở header website và avatar thương hiệu' },
    { key: 'brand_horizontal_logo', title: 'Logo Ngang / Full Brand', desc: 'Hiển thị ở footer hoặc banner trang chủ' },
    { key: 'brand_favicon', title: 'Favicon Website', desc: 'Biểu tượng tab trình duyệt (ICO / PNG)' },
    { key: 'brand_hero_banner', title: 'Banner Trang Chủ (Hero Banner)', desc: 'Ảnh nền lớn ở đầu trang chủ' },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-6">
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
          <label className="block text-sm font-bold text-red-800 mb-2">Tiêu Đề Website / SEO Title</label>
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              value={assets.brand_site_title?.value || 'Nước Mắm Cá Vàng - Tinh Túy Làng Nghề 200 Năm'}
              onChange={(e) => setAssets({
                ...assets,
                brand_site_title: { value: e.target.value, description: 'Tiêu đề hiển thị trên tab trình duyệt' },
              })}
              placeholder="Nước Mắm Cá Vàng - Tinh Túy Làng Nghề 200 Năm"
            />
            <Button
              className="bg-green-600 hover:bg-green-700 text-white whitespace-nowrap"
              onClick={() => handleUpdate('brand_site_title', assets.brand_site_title?.value || '', 'Tiêu đề hiển thị trên tab trình duyệt')}
            >
              <Save size={14} className="mr-1" /> Lưu Tiêu Đề
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {defaultKeys.map(item => {
          const currentVal = assets[item.key]?.value || '';
          return (
            <div key={item.key} className="border p-4 rounded-lg bg-gray-50 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-lg text-red-700">{item.title}</h3>
                <p className="text-xs text-gray-500 mb-3">{item.desc}</p>

                <div className="mb-4 flex items-center justify-center bg-white border h-36 rounded overflow-hidden relative">
                  {currentVal ? (
                    <img src={currentVal} alt={item.title} className="max-h-full max-w-full object-contain" />
                  ) : (
                    <span className="text-gray-400 text-sm">Chưa có ảnh</span>
                  )}
                  {uploadingKey === item.key && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-sm font-bold">
                      Đang tải lên...
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="Hoặc dán URL hình ảnh trực tiếp"
                  value={currentVal}
                  onChange={(e) => setAssets({
                    ...assets,
                    [item.key]: { value: e.target.value, description: item.desc }
                  })}
                  className="text-xs"
                />
                <div className="flex gap-2">
                  <label className="flex-1 cursor-pointer bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-3 rounded text-center text-xs flex items-center justify-center">
                    <Plus size={14} className="mr-1" /> Tải Ảnh Lên
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/svg+xml"
                      className="hidden"
                      onChange={(e) => handleFileChange(item.key, e, item.desc)}
                    />
                  </label>
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white text-xs"
                    onClick={() => handleUpdate(item.key, currentVal, item.desc)}
                  >
                    <Save size={14} className="mr-1" /> Lưu
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
        </div>
      </div>
    </div>
  );
}
