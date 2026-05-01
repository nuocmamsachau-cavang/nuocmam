import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit2, Trash2, Eye, EyeOff } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface AdminUser {
  id: number;
  username: string;
  email?: string;
  createdAt: Date;
}

export default function AdminUsers() {
  const [admins, setAdmins] = useState<AdminUser[]>([
    {
      id: 1,
      username: "GOSA",
      email: "admin@nuocmamcavang.com",
      createdAt: new Date(),
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleAddAdmin = () => {
    if (!formData.username || !formData.password) {
      alert("Vui lòng nhập username và password");
      return;
    }

    if (editingId) {
      // Update existing admin
      setAdmins(
        admins.map((admin) =>
          admin.id === editingId
            ? {
                ...admin,
                username: formData.username,
                email: formData.email,
              }
            : admin
        )
      );
    } else {
      // Add new admin
      const newAdmin: AdminUser = {
        id: Math.max(...admins.map((a) => a.id), 0) + 1,
        username: formData.username,
        email: formData.email,
        createdAt: new Date(),
      };
      setAdmins([...admins, newAdmin]);
    }

    setFormData({ username: "", email: "", password: "" });
    setEditingId(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (admin: AdminUser) => {
    setFormData({
      username: admin.username,
      email: admin.email || "",
      password: "",
    });
    setEditingId(admin.id);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (id === 1) {
      alert("Không thể xóa tài khoản admin chính");
      return;
    }
    setAdmins(admins.filter((admin) => admin.id !== id));
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setFormData({ username: "", email: "", password: "" });
    setEditingId(null);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-red-700">Quản Lý Tài Khoản Admin</h1>
        <Button
          onClick={() => setIsDialogOpen(true)}
          className="bg-red-700 hover:bg-red-800 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Thêm Admin Mới
        </Button>
      </div>

      {/* Admin List */}
      <Card>
        <CardHeader>
          <CardTitle>Danh Sách Tài Khoản Admin</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Username
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Email
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Ngày Tạo
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Hành Động
                  </th>
                </tr>
              </thead>
              <tbody>
                {admins.map((admin) => (
                  <tr key={admin.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{admin.username}</td>
                    <td className="py-3 px-4 text-gray-600">
                      {admin.email || "—"}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {admin.createdAt.toLocaleDateString("vi-VN")}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(admin)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(admin.id)}
                          className="text-red-600 hover:text-red-800"
                          disabled={admin.id === 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Chỉnh Sửa Tài Khoản Admin" : "Thêm Tài Khoản Admin Mới"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <Input
                type="text"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                placeholder="Nhập username"
                className="w-full border-gray-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="Nhập email (tùy chọn)"
                className="w-full border-gray-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mật Khẩu {editingId ? "(để trống nếu không đổi)" : ""}
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="Nhập mật khẩu"
                  className="w-full border-gray-300 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleAddAdmin}
                className="flex-1 bg-red-700 hover:bg-red-800 text-white"
              >
                {editingId ? "Cập Nhật" : "Thêm"}
              </Button>
              <Button
                onClick={handleCloseDialog}
                variant="outline"
                className="flex-1 border-gray-300"
              >
                Hủy
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
