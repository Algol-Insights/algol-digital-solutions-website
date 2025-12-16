'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui-lib/button';
import { User, Mail, Calendar, Shield, LogOut, Package, Heart, Settings, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const user = session.user as any;

  const handleSignOut = async () => {
    await signOut({ callbackUrl: window.location.origin });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-8 mb-8"
        >
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-teal-500 to-blue-500 flex items-center justify-center text-white text-3xl font-bold">
              {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {user.name || 'User'}
              </h1>
              <p className="text-gray-600 mb-4">{user.email}</p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-medium">
                  <Shield size={16} />
                  {user.role === 'admin' ? 'Administrator' : 'Customer'}
                </span>
              </div>
            </div>

            {/* Sign Out Button */}
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="flex items-center gap-2"
            >
              <LogOut size={18} />
              Sign Out
            </Button>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="md:col-span-2 space-y-6"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Actions</h2>

            <div className="grid sm:grid-cols-2 gap-4">
              <Link href="/order-tracking">
                <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition cursor-pointer border border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-teal-100 flex items-center justify-center">
                      <Package className="text-teal-600" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">My Orders</h3>
                      <p className="text-sm text-gray-600">Track & manage orders</p>
                    </div>
                  </div>
                </div>
              </Link>

              <Link href="/profile/settings">
                <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition cursor-pointer border border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Settings className="text-blue-600" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Profile Settings</h3>
                      <p className="text-sm text-gray-600">Edit profile & addresses</p>
                    </div>
                  </div>
                </div>
              </Link>

              <Link href="/wishlist">
                <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition cursor-pointer border border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-pink-100 flex items-center justify-center">
                      <Heart className="text-pink-600" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Wishlist</h3>
                      <p className="text-sm text-gray-600">View saved items</p>
                    </div>
                  </div>
                </div>
              </Link>

              <Link href="/cart">
                <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition cursor-pointer border border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                      <ShoppingCart className="text-green-600" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Shopping Cart</h3>
                      <p className="text-sm text-gray-600">View cart items</p>
                    </div>
                  </div>
                </div>
              </Link>

              {user.role === 'admin' && (
                <Link href="/admin">
                  <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition cursor-pointer border border-gray-100">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                        <Shield className="text-purple-600" size={24} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Admin Panel</h3>
                        <p className="text-sm text-gray-600">Manage store</p>
                      </div>
                    </div>
                  </div>
                </Link>
              )}
            </div>

            {/* Account Information */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Account Information</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <User className="text-gray-400 mt-1" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">Full Name</p>
                    <p className="font-medium text-gray-900">{user.name || 'Not set'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="text-gray-400 mt-1" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">Email Address</p>
                    <p className="font-medium text-gray-900">{user.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Account</h2>

            <div className="bg-white rounded-xl shadow-md p-6">
              <p className="text-gray-600 text-center py-8">
                Welcome to your account!
              </p>
            </div>

            {/* Security Tips */}
            <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-xl p-6 border border-teal-100">
              <h3 className="font-bold text-gray-900 mb-3">Security Tips</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-teal-600 font-bold">•</span>
                  <span>Use a strong, unique password</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-600 font-bold">•</span>
                  <span>Keep your email address up to date</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-600 font-bold">•</span>
                  <span>Review your account activity regularly</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
