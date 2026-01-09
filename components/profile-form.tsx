'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateProfile, type ProfileFormData } from '@/lib/actions/profile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, User, Building, MapPin } from 'lucide-react';
import type { UserProfile } from '@/lib/db/schema';

interface ProfileFormProps {
  initialData?: UserProfile;
  userEmail: string;
}

export function ProfileForm({ initialData, userEmail }: ProfileFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    name: initialData?.name || '',
    surname: initialData?.surname || '',
    phone: initialData?.phone || '',
    idNumber: initialData?.idNumber || '',
    bankName: initialData?.bankName || '',
    accountHolder: initialData?.accountHolder || '',
    accountNumber: initialData?.accountNumber || '',
    branchCode: initialData?.branchCode || '',
    deliveryAddress: initialData?.deliveryAddress || '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await updateProfile(formData);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success('Profile updated successfully!');
      router.refresh();
    } catch {
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Personal Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-stone-600" />
            <CardTitle className="text-lg">Personal Information</CardTitle>
          </div>
          <CardDescription>
            Your personal details for identification and contact
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">First Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John"
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="surname">Surname</Label>
            <Input
              id="surname"
              name="surname"
              value={formData.surname}
              onChange={handleChange}
              placeholder="Doe"
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={userEmail}
              disabled
              className="bg-stone-50"
            />
            <p className="text-xs text-stone-500">Email cannot be changed</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+27 12 345 6789"
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="idNumber">ID Number</Label>
            <Input
              id="idNumber"
              name="idNumber"
              value={formData.idNumber}
              onChange={handleChange}
              placeholder="Enter your ID number"
              required
              disabled={isLoading}
            />
          </div>
        </CardContent>
      </Card>

      {/* Banking Details */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Building className="h-5 w-5 text-stone-600" />
            <CardTitle className="text-lg">Banking Details</CardTitle>
          </div>
          <CardDescription>
            For EFT payments when your artwork sells (you receive 55% of the
            selling price)
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="bankName">Bank Name</Label>
            <Input
              id="bankName"
              name="bankName"
              value={formData.bankName}
              onChange={handleChange}
              placeholder="e.g., FNB, Standard Bank"
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="accountHolder">Account Holder Name</Label>
            <Input
              id="accountHolder"
              name="accountHolder"
              value={formData.accountHolder}
              onChange={handleChange}
              placeholder="Name as it appears on account"
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="accountNumber">Account Number</Label>
            <Input
              id="accountNumber"
              name="accountNumber"
              value={formData.accountNumber}
              onChange={handleChange}
              placeholder="Enter account number"
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="branchCode">Branch Code</Label>
            <Input
              id="branchCode"
              name="branchCode"
              value={formData.branchCode}
              onChange={handleChange}
              placeholder="e.g., 250655"
              required
              disabled={isLoading}
            />
          </div>
        </CardContent>
      </Card>

      {/* Delivery Address */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-stone-600" />
            <CardTitle className="text-lg">Delivery Address</CardTitle>
          </div>
          <CardDescription>
            Address for returning unsold artwork
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="deliveryAddress">Full Address</Label>
            <Textarea
              id="deliveryAddress"
              name="deliveryAddress"
              value={formData.deliveryAddress}
              onChange={handleChange}
              placeholder="Street address, suburb, city, postal code"
              rows={3}
              required
              disabled={isLoading}
            />
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button
          type="submit"
          className="bg-stone-900 hover:bg-stone-800"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : initialData?.isComplete ? (
            'Update Profile'
          ) : (
            'Complete Profile'
          )}
        </Button>
      </div>
    </form>
  );
}
