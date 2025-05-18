'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
}

interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  token: string;
  category: {
    id: string;
    name: string;
  };
  provider: {
    id: string;
    name: string;
    avatar: string;
    walletAddress: string;
  };
  isUnlocked?: boolean;
}

export default function CategoryDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = params.categoryId as string;
  
  const [category, setCategory] = useState<Category | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        setLoading(true);
        
        // Fetch category details
        const categoryResponse = await fetch(`/api/categories/${categoryId}`);
        
        if (!categoryResponse.ok) {
          throw new Error('Failed to fetch category details');
        }
        
        const categoryData = await categoryResponse.json();
        
        if (!categoryData.success) {
          throw new Error(categoryData.error?.message || 'Failed to fetch category details');
        }
        
        setCategory(categoryData.data);
        
        // Fetch category services
        const servicesResponse = await fetch(`/api/categories/${categoryId}/services?page=${page}`);
        
        if (!servicesResponse.ok) {
          throw new Error('Failed to fetch category services');
        }
        
        const servicesData = await servicesResponse.json();
        
        if (!servicesData.success) {
          throw new Error(servicesData.error?.message || 'Failed to fetch category services');
        }
        
        setServices(servicesData.data);
        setTotalPages(servicesData.pagination?.pages || 1);
      } catch (err: any) {
        console.error('Error fetching category data:', err);
        setError(err.message || 'An error occurred while fetching data');
      } finally {
        setLoading(false);
      }
    };
    
    if (categoryId) {
      fetchCategoryData();
    }
  }, [categoryId, page]);

  const changePage = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Spinner size="lg" />
        <p className="mt-4 text-gray-600">Loading category details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="text-red-500 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold mb-2">Error Loading Category</h2>
        <p className="text-gray-600">{error}</p>
        <Button 
          onClick={() => router.push('/categories')} 
          variant="primary"
          className="mt-4"
        >
          Back to Categories
        </Button>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="text-yellow-500 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold mb-2">Category Not Found</h2>
        <p className="text-gray-600">The category you're looking for doesn't exist or has been removed.</p>
        <Button 
          onClick={() => router.push('/categories')} 
          variant="primary"
          className="mt-4"
        >
          Back to Categories
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/categories" className="text-blue-600 hover:underline flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to All Categories
        </Link>
      </div>

      <div className="flex items-center mb-8">
        <div className="text-4xl mr-4">{category.icon}</div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{category.name}</h1>
          <p className="text-gray-600 mt-2">{category.description}</p>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-6">{services.length > 0 ? 'Available Services' : 'No Services Available'}</h2>
        
        {services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Link href={`/services/${service.id}`} key={service.id}>
                <Card className="h-full hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
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
            <p className="text-gray-600">There are currently no services available in this category.</p>
          </div>
        )}
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex space-x-2">
              <Button 
                onClick={() => changePage(page - 1)} 
                disabled={page === 1}
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
                disabled={page === totalPages}
                variant="outline"
                size="sm"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}