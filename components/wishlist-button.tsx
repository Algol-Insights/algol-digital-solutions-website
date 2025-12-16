'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Heart, Loader2 } from 'lucide-react';
import { useWishlistStore } from '@/lib/wishlist-store';

interface WishlistButtonProps {
  productId: string;
  variantId?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export function WishlistButton({ productId, variantId, size = 'md', showText = false }: WishlistButtonProps) {
  const { data: session } = useSession();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [loading, setLoading] = useState(false);
  const { incrementCount, decrementCount } = useWishlistStore();

  useEffect(() => {
    if (session?.user) {
      checkWishlistStatus();
    }
  }, [session, productId, variantId]);

  const checkWishlistStatus = async () => {
    try {
      const response = await fetch('/api/wishlist');
      if (response.ok) {
        const data = await response.json();
        const exists = data.items.some(
          (item: any) =>
            item.productId === productId &&
            (variantId ? item.variantId === variantId : !item.variantId)
        );
        setIsInWishlist(exists);
      }
    } catch (error) {
      console.error('Error checking wishlist:', error);
    }
  };

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session?.user) {
      window.location.href = '/auth/login?callbackUrl=' + encodeURIComponent(window.location.pathname);
      return;
    }

    setLoading(true);

    try {
      if (isInWishlist) {
        // Remove from wishlist
        const response = await fetch('/api/wishlist');
        if (response.ok) {
          const data = await response.json();
          const item = data.items.find(
            (i: any) =>
              i.productId === productId &&
              (variantId ? i.variantId === variantId : !i.variantId)
          );

          if (item) {
            const deleteResponse = await fetch(`/api/wishlist/${item.id}`, {
              method: 'DELETE',
            });

            if (deleteResponse.ok) {
              setIsInWishlist(false);
              decrementCount();
            }
          }
        }
      } else {
        // Add to wishlist
        const response = await fetch('/api/wishlist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            productId,
            variantId: variantId || null,
          }),
        });

        if (response.ok) {
          setIsInWishlist(true);
          incrementCount();
        }
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  return (
    <button
      onClick={toggleWishlist}
      disabled={loading}
      className={`${sizeClasses[size]} flex items-center justify-center rounded-full border-2 transition-all ${
        isInWishlist
          ? 'bg-red-500 border-red-500 text-white hover:bg-red-600'
          : 'bg-white border-gray-300 text-gray-600 hover:border-red-500 hover:text-red-500'
      } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      {loading ? (
        <Loader2 className="animate-spin" size={iconSizes[size]} />
      ) : (
        <Heart
          size={iconSizes[size]}
          fill={isInWishlist ? 'currentColor' : 'none'}
          className="transition-all"
        />
      )}
      {showText && (
        <span className="ml-2 text-sm font-medium">
          {isInWishlist ? 'Saved' : 'Save'}
        </span>
      )}
    </button>
  );
}
