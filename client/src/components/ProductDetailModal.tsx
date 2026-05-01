import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { ShoppingCart, X } from "lucide-react";

interface Product {
  id: number;
  name: string;
  price: string | number;
  description?: string;
  imageUrl?: string;
  categoryId: number;
}

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

export function ProductDetailModal({
  product,
  isOpen,
  onClose,
  onAddToCart,
}: ProductDetailModalProps) {
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    setQuantity(1);
    onClose();
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 1;
    setQuantity(Math.max(1, value));
  };

  const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-red-700">
            {product.name}
          </DialogTitle>
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          {/* Product Image */}
          <div className="flex items-center justify-center bg-gray-100 rounded-lg p-4 min-h-80">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="max-w-full max-h-80 object-contain"
              />
            ) : (
              <div className="text-gray-400 text-center">
                <p className="text-sm">Không có hình ảnh</p>
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="flex flex-col justify-between">
            <div>
              {/* Price */}
              <div className="mb-6">
                <p className="text-gray-600 text-sm mb-2">Giá bán</p>
                <p className="text-3xl font-bold text-red-700">
                  {price.toLocaleString()}₫
                </p>
              </div>

              {/* Description */}
              {product.description && (
                <div className="mb-6">
                  <p className="text-gray-600 text-sm mb-2">Mô tả</p>
                  <p className="text-gray-700 leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Default Description */}
              {!product.description && (
                <div className="mb-6">
                  <p className="text-gray-600 text-sm mb-2">Mô tả</p>
                  <p className="text-gray-700 leading-relaxed">
                    Nước mắm truyền thống từ làng Sa Châu, được sản xuất theo công thức
                    lâu đời hơn 200 năm. Hương vị đậm đà, mặn mà, phù hợp cho mọi món ăn.
                  </p>
                </div>
              )}

              {/* Product Info */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-gray-600 text-xs">Loại sản phẩm</p>
                  <p className="text-gray-800 font-medium">Nước Mắm</p>
                </div>
                <div>
                  <p className="text-gray-600 text-xs">Xuất xứ</p>
                  <p className="text-gray-800 font-medium">Sa Châu, Ninh Bình</p>
                </div>
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-3">
              <div>
                <label className="block text-gray-600 text-sm mb-2">
                  Số lượng
                </label>
                <Input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="w-full border-gray-300"
                />
              </div>

              <Button
                onClick={handleAddToCart}
                className="w-full bg-red-700 hover:bg-red-800 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
              >
                <ShoppingCart className="h-5 w-5" />
                Thêm vào giỏ hàng
              </Button>

              <Button
                onClick={onClose}
                variant="outline"
                className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 py-3 rounded-lg font-semibold"
              >
                Đóng
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
