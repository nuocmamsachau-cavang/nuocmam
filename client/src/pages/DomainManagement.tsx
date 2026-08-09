import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, AlertCircle, Copy } from 'lucide-react';

export default function DomainManagement() {
  const [customDomain, setCustomDomain] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [savedDomain, setSavedDomain] = useState('nuocmampro-fdjnndux.manus.space');

  const handleAddDomain = async () => {
    if (!customDomain.trim()) {
      setStatus('error');
      setMessage('Vui lòng nhập tên miền');
      return;
    }

    setStatus('loading');
    try {
      // Simulate saving domain (in real app, this would call an API)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSavedDomain(customDomain);
      setStatus('success');
      setMessage(`✓ Tên miền ${customDomain} đã được cấu hình thành công!`);
      setCustomDomain('');
      
      // Reset status after 3 seconds
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      setStatus('error');
      setMessage('Lỗi khi cấu hình tên miền. Vui lòng thử lại.');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setMessage('✓ Đã copy vào clipboard!');
    setTimeout(() => setMessage(''), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-yellow-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-red-900 mb-2">Quản Lý Tên Miền</h1>
          <p className="text-gray-600">Cấu hình custom domain cho website của bạn</p>
        </div>

        {/* Current Domain */}
        <Card className="mb-6 border-red-200">
          <CardHeader>
            <CardTitle className="text-red-900">Tên Miền Hiện Tại</CardTitle>
            <CardDescription>Tên miền mặc định của website</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between bg-gray-100 p-4 rounded-lg">
              <code className="text-sm font-mono text-gray-800">{savedDomain}</code>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(savedDomain)}
                className="ml-2"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Add Custom Domain */}
        <Card className="mb-6 border-yellow-200">
          <CardHeader>
            <CardTitle className="text-red-900">Thêm Custom Domain</CardTitle>
            <CardDescription>Nhập tên miền riêng của bạn (ví dụ: www.gosa.com.vn)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên Miền
              </label>
              <Input
                type="text"
                placeholder="www.gosa.com.vn"
                value={customDomain}
                onChange={(e) => setCustomDomain(e.target.value)}
                className="border-red-200 focus:border-red-500"
              />
            </div>

            <Button
              onClick={handleAddDomain}
              disabled={status === 'loading'}
              className="w-full bg-red-600 hover:bg-red-700 text-white"
            >
              {status === 'loading' ? 'Đang xử lý...' : 'Cấu Hình Domain'}
            </Button>

            {message && (
              <Alert className={status === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}>
                <AlertCircle className={status === 'success' ? 'text-green-600' : 'text-red-600'} />
                <AlertDescription className={status === 'success' ? 'text-green-800' : 'text-red-800'}>
                  {message}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* DNS Configuration Guide */}
        <Card className="border-yellow-200">
          <CardHeader>
            <CardTitle className="text-red-900">Hướng Dẫn Cấu Hình DNS</CardTitle>
            <CardDescription>Cập nhật DNS tại nhà cung cấp tên miền của bạn</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <h3 className="font-semibold text-red-900 mb-3">Thêm DNS Record:</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Loại (Type):</span>
                  <code className="ml-2 bg-white px-2 py-1 rounded border border-yellow-300">CNAME</code>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Host:</span>
                  <code className="ml-2 bg-white px-2 py-1 rounded border border-yellow-300">www</code>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Value:</span>
                  <code className="ml-2 bg-white px-2 py-1 rounded border border-yellow-300">{savedDomain}</code>
                </div>
                <div>
                  <span className="font-medium text-gray-700">TTL:</span>
                  <code className="ml-2 bg-white px-2 py-1 rounded border border-yellow-300">3600</code>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-2">Các Bước:</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
                <li>Đăng nhập vào tài khoản quản lý tên miền (Mắt Bào, GoDaddy, v.v.)</li>
                <li>Tìm mục "Cấu hình DNS" hoặc "DNS Management"</li>
                <li>Thêm CNAME record với thông tin trên</li>
                <li>Chờ 5-48 giờ để DNS propagate</li>
                <li>Nhập tên miền ở trên và nhấn "Cấu Hình Domain"</li>
              </ol>
            </div>

            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h3 className="font-semibold text-green-900 mb-2">Kiểm Tra DNS:</h3>
              <p className="text-sm text-green-800 mb-2">
                Kiểm tra trạng thái DNS tại: <a href="https://www.whatsmydns.net/" target="_blank" rel="noopener noreferrer" className="underline">whatsmydns.net</a>
              </p>
              <p className="text-sm text-green-800">
                Nhập tên miền của bạn và chọn "CNAME" để xem trạng thái cập nhật
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
