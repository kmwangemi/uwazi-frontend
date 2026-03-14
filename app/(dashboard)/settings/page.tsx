'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/lib/store'
import { ProfileForm } from '@/components/forms/ProfileForm'
import { PasswordForm } from '@/components/forms/PasswordForm'
import { NotificationsForm } from '@/components/forms/NotificationsForm'
import { Bell, Lock, User, LogOut } from 'lucide-react'

export default function SettingsPage() {
  const { user, logout } = useAuthStore()
  const [activeTab, setActiveTab] = useState<'account' | 'notifications' | 'security'>('account')

  const handleLogout = () => {
    logout()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-[#94a3b8]">Manage your account and system preferences</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-[#1f2937] pb-4">
        <button
          onClick={() => setActiveTab('account')}
          className={`px-4 py-2 font-semibold transition flex items-center gap-2 ${
            activeTab === 'account'
              ? 'text-[#00ff88] border-b-2 border-[#00ff88]'
              : 'text-[#94a3b8] hover:text-white'
          }`}
        >
          <User className="w-4 h-4" />
          Account
        </button>
        <button
          onClick={() => setActiveTab('notifications')}
          className={`px-4 py-2 font-semibold transition flex items-center gap-2 ${
            activeTab === 'notifications'
              ? 'text-[#00ff88] border-b-2 border-[#00ff88]'
              : 'text-[#94a3b8] hover:text-white'
          }`}
        >
          <Bell className="w-4 h-4" />
          Notifications
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`px-4 py-2 font-semibold transition flex items-center gap-2 ${
            activeTab === 'security'
              ? 'text-[#00ff88] border-b-2 border-[#00ff88]'
              : 'text-[#94a3b8] hover:text-white'
          }`}
        >
          <Lock className="w-4 h-4" />
          Security
        </button>
      </div>



      {/* Account Tab */}
      {activeTab === 'account' && (
        <div className="space-y-6">
          {/* Profile */}
          <Card className="bg-[#121418] border-[#1f2937] p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Profile Information</h2>
            <ProfileForm />
          </Card>

          {/* Role & Permissions */}
          <Card className="bg-[#121418] border-[#1f2937] p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Role & Permissions</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-[#1a1d23] rounded border border-[#1f2937]">
                <div>
                  <p className="text-white font-semibold">Current Role</p>
                  <p className="text-sm text-[#94a3b8]">{user?.role || 'Viewer'}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-[#64748b] mb-1">View access to:</p>
                  <p className="text-sm text-[#00ff88] font-semibold">
                    {user?.role === 'admin' ? 'All data & settings' : 'Assigned cases & reports'}
                  </p>
                </div>
              </div>
              <p className="text-sm text-[#94a3b8]">
                Contact your administrator to change your role or request additional permissions.
              </p>
            </div>
          </Card>

          {/* Danger Zone */}
          <Card className="bg-[#1a1d23] border-[#ef4444]/30 p-6">
            <h2 className="text-lg font-semibold text-[#ef4444] mb-4">Danger Zone</h2>
            <div className="space-y-3">
              <p className="text-sm text-[#94a3b8]">Once you logout, you will need to sign in again.</p>
              <Button
                onClick={handleLogout}
                className="w-full bg-[#ef4444] text-white hover:bg-[#ef4444]/90"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="space-y-4">
          <Card className="bg-[#121418] border-[#1f2937] p-6">
            <h2 className="text-lg font-semibold text-white mb-6">Alert Preferences</h2>
            <NotificationsForm />
          </Card>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <Card className="bg-[#121418] border-[#1f2937] p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Change Password</h2>
            <PasswordForm />
          </Card>

          <Card className="bg-[#121418] border-[#1f2937] p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Two-Factor Authentication</h2>
            <div className="space-y-4">
              <p className="text-[#94a3b8]">
                Enhance your account security with two-factor authentication. When enabled, you'll need to enter a
                code from your phone in addition to your password.
              </p>
              <Button variant="outline" className="border-[#1f2937] text-white w-full">
                Enable 2FA
              </Button>
            </div>
          </Card>

          <Card className="bg-[#121418] border-[#1f2937] p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Active Sessions</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-[#1a1d23] rounded border border-[#1f2937]">
                <div>
                  <p className="text-white font-semibold">Current Session</p>
                  <p className="text-sm text-[#94a3b8]">This browser - Last active now</p>
                </div>
                <span className="px-2 py-1 bg-[#00ff88]/10 text-[#00ff88] text-xs rounded font-semibold">
                  ACTIVE
                </span>
              </div>
              <p className="text-xs text-[#94a3b8]">
                No other active sessions. Your account is secure.
              </p>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
