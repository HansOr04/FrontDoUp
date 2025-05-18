'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';

interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  token: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  provider: {
    id: string;
    name: string;
    avatar: string;
    walletAddress: string;
  };
  isUnlocked?: boolean;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
}

export default function ServicesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        
        const data = await response.json();
        
        if (data.success) {
          setCategories(data.data);
        } else {
          console.error('Error fetching categories:', data.error);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    
    fetchCategories();
  }, []);

  // Fetch services when search params change
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setSearchLoading(true);
        
        const queryParams = new URLSearchParams();
        
        if (searchQuery) {
          queryParams.set('q', searchQuery);
        }
        
        if (selectedCategory) {
          queryParams.set('category', selectedCategory);
        }
        
        queryParams.set('page', page.toString());
        
        const response = await fetch(`/api/services/search?${queryParams.toString()}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch services');
        }
        
        const data = await response.json();
        
        if (data.success) {
          setServices(data.data);
          setTotalPages(data.pagination?.pages || 1);
        } else {
          throw new Error(data.error?.message || 'Failed to fetch services');
        }
      } catch (err: any) {
        console.error('Error fetching services:', err);
        setError(err.message || 'An error occurred while fetching services');
      } finally {
        setLoading(false);
        setSearchLoading(false);
      }
    };
    
    fetchServices();
  }, [searchQuery, selectedCategory, page]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset to first page when search changes
    setPage(1);
    
    // Update URL params
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (selectedCategory) params.set('category', selectedCategory);
    
    router.push(`/services?${params.toString()}`);
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setPage(1);
    
    // Update URL params
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (categoryId) params.set('category', categoryId);
    
    router.push(`/services?${params.toString()}`);
  };

  const changePage = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      
      // Update URL params
      const params = new URLSearchParams();
      if (searchQuery) params.set('q', searchQuery);
      if (selectedCategory) params.set('category', selectedCategory);
      params.set('page', newPage.toString());
      
      router.push(`/services?${params.toString()}`);
    }
  };

  if (loading && !searchLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Spinner size="lg" />
        <p className="mt-4 text-gray-600">Loading services...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Find Services</h1>
        <p className="text-gray-600 mt-2">Search for services or browse by category</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              id="search"
              placeholder="Search for services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="md:w-1/3">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="md:flex md:items-end">
            <Button 
              type="submit" 
              variant="primary"
              size="lg"
              loading={searchLoading}
              className="w-full md:w-auto mt-6"
            >
              Search
            </Button>
          </div>
        </form>
      </div>

      {error ? (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium">Error</h3>
              <div className="mt-2 text-sm">{error}</div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-semibold">
              {searchQuery || selectedCategory ? 'Search Results' : 'All Services'}
            </h2>
            <div className="text-sm text-gray-600">
              {services.length} {services.length === 1 ? 'service' : 'services'} found
            </div>
          </div>
          
          {services.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <Link href={`/services/${service.id}`} key={service.id}>
                  <Card className="h-full hover:shadow-md transition-shadow">
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                      <div className="bg-gray-100 text-gray-800 text-xs py-1 px-2 rounded inline-block mb-3">
                        {service.category.name}
                      </div>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">{service.description}</p>
                      
                      <div className="flex items-center mb-4">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold border border-blue-200">
                          {service.provider.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="ml-2 text-sm text-gray-700">{service.provider.name}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="font-bold text-lg">
                          {service.price} {service.token}
                        </div>
                        {service.isUnlocked ? (
                          <span className="text-sm bg-green-100 text-green-800 py-1 px-2 rounded">
                            Unlocked
                          </span>
                        ) : (
                          <Button variant="primary" size="sm">
                            View Details
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <div className="text-gray-400 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">No Services Found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your search or category filters.</p>
              <Button 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('');
                  setPage(1);
                  router.push('/services');
                }} 
                variant="outline"
              >
                Reset Filters
              </Button>
            </div>
          )}
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <div className="flex space-x-2">
                <Button 
                  onClick={() => changePage(page - 1)} 
                  disabled={page === 1 || searchLoading}
                  variant="outline"
                  size="sm"
                >
                  Previous
                </Button>
                
                <div className="flex items-center px-4">
                  Page {page} of {totalPages}
                </div>
                
                <Button 
                  onClick={() => changePage(page + 1)} 
                  disabled={page === totalPages || searchLoading}
                  variant="outline"
                  size="sm"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}