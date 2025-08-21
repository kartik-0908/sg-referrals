'use client'
import React, { useState, useEffect } from 'react';
import { Calendar, Users, DollarSign, Loader2, CheckCircle, XCircle } from 'lucide-react';

interface UserData {
  maskedEmail: string;
  signupDate: string;
  name: string;
  hasActivePlan: boolean;
}

interface SignupResponse {
  success: boolean;
  count?: number;
  users?: UserData[];
  activePlansCount?: number;
  inactivePlansCount?: number;
  error?: string;
}

interface RevenueResponse {
  success: boolean;
  totalRevenue?: number;
  error?: string;
}

const Dashboard = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [loading, setLoading] = useState(false);
  const [signupData, setSignupData] = useState<SignupResponse | null>(null);
  const [revenueData, setRevenueData] = useState<RevenueResponse | null>(null);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch signup data
      const signupResponse = await fetch('https://pre.dashboard.stepgenie.app/api/referral/manik/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          year: selectedYear,
          month: selectedMonth,
        }),
      });
      const signupResult = await signupResponse.json();
      setSignupData(signupResult);

      // Fetch revenue data
      const revenueResponse = await fetch('https://pre.dashboard.stepgenie.app/api/referral/manik/revenue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          year: selectedYear,
          month: selectedMonth,
        }),
      });
      const revenueResult = await revenueResponse.json();
      setRevenueData(revenueResult);

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedYear, selectedMonth]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getConversionRate = () => {
    if (!signupData?.count || signupData.count === 0) return 0;
    const activePlans = signupData.activePlansCount || 0;
    return ((activePlans / signupData.count) * 100).toFixed(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">View signups and revenue data by month</p>
        </div>

        {/* Date Selector */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-center gap-4">
            <Calendar className="w-5 h-5 text-gray-500" />
            <h2 className="text-lg font-medium text-gray-900">Select Period</h2>
          </div>
          <div className="flex gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Year
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Month
              </label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {months.map((month, index) => (
                  <option key={index} value={index + 1}>
                    {month}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        )}

        {!loading && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {/* Total Signups Card */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-blue-100">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-900">Total Signups</h3>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {signupData?.count || 0}
                    </p>
                    <p className="text-xs text-gray-500">
                      {months[selectedMonth - 1]} {selectedYear}
                    </p>
                  </div>
                </div>
              </div>

              {/* Active Plans Card */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-green-100">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-900">Active Plans</h3>
                    <p className="text-2xl font-bold text-green-600 mt-1">
                      {signupData?.activePlansCount || 0}
                    </p>
                    <p className="text-xs text-gray-500">
                      {getConversionRate()}% conversion
                    </p>
                  </div>
                </div>
              </div>

              {/* Inactive Plans Card */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-red-100">
                    <XCircle className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-900">No Plans</h3>
                    <p className="text-2xl font-bold text-red-600 mt-1">
                      {signupData?.inactivePlansCount || 0}
                    </p>
                    <p className="text-xs text-gray-500">
                      Free users
                    </p>
                  </div>
                </div>
              </div>

              {/* Total Revenue Card */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-yellow-100">
                    <DollarSign className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-900">Total Revenue</h3>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {formatCurrency(revenueData?.totalRevenue || 0)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {months[selectedMonth - 1]} {selectedYear}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  User Signups - {months[selectedMonth - 1]} {selectedYear}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {signupData?.count || 0} users signed up this month
                  {signupData?.activePlansCount !== undefined && (
                    <span className="ml-2">
                      • {signupData.activePlansCount} with active plans
                    </span>
                  )}
                </p>
              </div>
              
              {signupData?.users && signupData.users.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Signup Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Plan Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {signupData.users.map((user, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {user.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.maskedEmail}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(user.signupDate).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {user.hasActivePlan ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                <XCircle className="w-3 h-3 mr-1" />
                                Free
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-12 text-center">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-500 mb-2">No signups found</p>
                  <p className="text-sm text-gray-400">
                    No users signed up in {months[selectedMonth - 1]} {selectedYear}
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;