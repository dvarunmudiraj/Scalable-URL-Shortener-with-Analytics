
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/layout/Navbar';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { toast } from '../hooks/use-toast';
import { Copy, ExternalLink, BarChart3, Trash2, Plus } from 'lucide-react';
import { apiCall } from '../lib/api';

interface ShortenedURL {
  id: string;
  originalUrl: string;
  shortCode: string;
  shortUrl: string;
  clicks: number;
  createdAt: string;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [urls, setUrls] = useState<ShortenedURL[]>([]);
  const [customCode, setCustomCode] = useState('');
  const [isLoadingUrls, setIsLoadingUrls] = useState(true);

  // Fetch user's URLs on component mount
  useEffect(() => {
    const fetchUrls = async () => {
      try {
        const response = await apiCall('/url/my-urls');
        console.log('Fetched URLs:', response);
        if (Array.isArray(response) && response.length > 0) {
          console.log('First URL item:', response[0]);
        } else if (response.urls && Array.isArray(response.urls) && response.urls.length > 0) {
          console.log('First URL item:', response.urls[0]);
        }
        // Normalize response to array and map fields
        let urlsArr = Array.isArray(response) ? response : (response.urls || []);
        urlsArr = urlsArr.map((item: any) => {
          const id = item.id || item._id || item.shortCode || item.short_code;
          const originalUrl = item.originalUrl || item.original_url || '';
          const shortCode = item.shortCode || item.short_code || '';
          const shortUrl = item.shortUrl || item.short_url || '';
          const clicks = item.clicks ?? 0;
          const createdAt = item.createdAt || item.created_at || '';
          if (!id || !originalUrl || !shortUrl || !createdAt) {
            console.warn('Skipping invalid url item:', item);
          }
          return { id, originalUrl, shortCode, shortUrl, clicks, createdAt };
        }).filter((item: any) => item.id && item.originalUrl && item.shortUrl && item.createdAt);
        setUrls(urlsArr);
      } catch (error) {
        console.error('Failed to fetch URLs:', error);
        toast({
          title: "Error",
          description: "Failed to load your URLs",
          variant: "destructive",
        });
      } finally {
        setIsLoadingUrls(false);
      }
    };
    fetchUrls();
  }, []);

  const handleShortenUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url) {
      toast({
        title: "Error",
        description: "Please enter a URL to shorten",
        variant: "destructive",
      });
      return;
    }

    try {
      new URL(url);
    } catch {
      toast({
        title: "Error",
        description: "Please enter a valid URL",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const payload: any = { originalUrl: url };
      if (customCode) {
        payload.customCode = customCode;
      }

      const response = await apiCall('/url/shorten', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      console.log('Shorten response:', response);
      // After shortening, re-fetch URLs from backend to ensure sync
      try {
        const urlsResponse = await apiCall('/url/my-urls');
        let urlsArr = Array.isArray(urlsResponse) ? urlsResponse : (urlsResponse.urls || []);
        urlsArr = urlsArr.map((item: any) => {
          const id = item.id || item._id || item.shortCode || item.short_code;
          const originalUrl = item.originalUrl || item.original_url || '';
          const shortCode = item.shortCode || item.short_code || '';
          const shortUrl = item.shortUrl || item.short_url || '';
          const clicks = item.clicks ?? 0;
          const createdAt = item.createdAt || item.created_at || '';
          if (!id || !originalUrl || !shortUrl || !createdAt) {
            console.warn('Skipping invalid url item:', item);
          }
          return { id, originalUrl, shortCode, shortUrl, clicks, createdAt };
        }).filter((item: any) => item.id && item.originalUrl && item.shortUrl && item.createdAt);
        setUrls(urlsArr);
      } catch (err) {
        // fallback: just prepend the new one if fetch fails
        const urlObj = {
          id: response.id,
          originalUrl: response.originalUrl || response.original_url,
          shortCode: response.shortCode || response.short_code,
          shortUrl: response.shortUrl || response.short_url,
          clicks: response.clicks ?? 0,
          createdAt: response.createdAt || response.created_at,
        };
        setUrls(prev => [urlObj, ...prev]);
      }
      setUrl('');
      setCustomCode('');
      toast({
        title: "Success",
        description: "URL shortened successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to shorten URL. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (shortUrl: string) => {
    navigator.clipboard.writeText(shortUrl);
    toast({
      title: "Copied",
      description: "Short URL copied to clipboard!",
    });
  };

  const deleteUrl = async (id: string) => {
    try {
      await apiCall(`/url/${id}`, {
        method: 'DELETE',
      });
      
      setUrls(prev => prev.filter(url => url.id !== id));
      toast({
        title: "Deleted",
        description: "URL deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete URL. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Welcome back, {user?.username}! 👋
          </h1>
          <p className="text-xl text-gray-300">
            Create and manage your shortened URLs with detailed analytics.
          </p>
        </div>

        {/* URL Shortener Form */}
        <div className="glass p-8 rounded-2xl mb-12 neon-glow">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Plus className="w-6 h-6 mr-2 text-purple-400" />
            Shorten a New URL
          </h2>
          
          <form onSubmit={handleShortenUrl} className="space-y-6">
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-300 mb-2">
                Original URL
              </label>
              <Input
                id="url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.example.com/your-long-url"
                className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400"
                required
              />
            </div>

            <div>
              <label htmlFor="customCode" className="block text-sm font-medium text-gray-300 mb-2">
                Custom Short Code (Optional)
              </label>
              <Input
                id="customCode"
                type="text"
                value={customCode}
                onChange={(e) => setCustomCode(e.target.value)}
                placeholder="custom-code"
                className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400"
              />
            </div>

            <Button
              type="submit"
              className="bg-primary hover:bg-primary/80 neon-glow px-8 py-3"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Shortening...
                </div>
              ) : (
                'Shorten URL'
              )}
            </Button>
          </form>
        </div>

        {/* URLs Table */}
        <div className="glass rounded-2xl overflow-hidden neon-glow-blue">
          <div className="p-6 border-b border-white/10">
            <h2 className="text-2xl font-bold text-white">Your Shortened URLs</h2>
            <p className="text-gray-300 mt-2">Manage and track all your shortened links</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="text-left p-4 text-gray-300 font-medium">Original URL</th>
                  <th className="text-left p-4 text-gray-300 font-medium">Short URL</th>
                  <th className="text-left p-4 text-gray-300 font-medium">Clicks</th>
                  <th className="text-left p-4 text-gray-300 font-medium">Created</th>
                  <th className="text-left p-4 text-gray-300 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {urls.map((urlItem) => (
                  <tr key={urlItem.id || urlItem.shortCode} className="border-b border-white/10 hover:bg-white/5">
                    <td className="p-4">
                      <div className="text-white truncate max-w-xs" title={urlItem.originalUrl}>
                        {urlItem.originalUrl}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-purple-400 font-mono">{urlItem.shortUrl}</span>
                        <button
                          onClick={() => copyToClipboard(urlItem.shortUrl)}
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-white font-semibold">{urlItem.clicks}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-gray-300">
                        {new Date(urlItem.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <Link 
                          to={`/analytics/${urlItem.shortCode}`}
                          className="p-2 glass glass-hover rounded-lg text-blue-400 hover:text-blue-300"
                        >
                          <BarChart3 className="w-4 h-4" />
                        </Link>
                        <a
                          href={urlItem.shortUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 glass glass-hover rounded-lg text-green-400 hover:text-green-300"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => deleteUrl(urlItem.id)}
                          className="p-2 glass glass-hover rounded-lg text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {isLoadingUrls ? (
            <div className="text-center py-12">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-400">Loading your URLs...</p>
            </div>
          ) : urls.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No URLs shortened yet</p>
              <p className="text-gray-500 mt-2">Create your first short URL above</p>
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;