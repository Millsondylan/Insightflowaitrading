import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { toast } from '@/components/ui/use-toast';
import { Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    acceptTerms: false,
    receiveUpdates: false
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    acceptTerms: ''
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
      acceptTerms: ''
    };
    
    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
      isValid = false;
    }
    
    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }
    
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }
    
    // Terms acceptance validation
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the terms and conditions';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { success, error } = await signup(formData.email, formData.password, {
        name: formData.name,
        receiveUpdates: formData.receiveUpdates
      });
      
      if (success) {
        toast({
          title: "Account created!",
          description: "Please check your email to verify your account.",
          duration: 5000,
        });
        navigate('/auth');
      } else {
        throw error;
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to create account. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Div className="container mx-auto px-4 py-12 max-w-md">
      <Card className="bg-black/30 border-white/10 backdrop-blur-md text-white" />
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center" />Create Your Account</HTMLInputElement />
        <CardContent>
          <Form onSubmit={handleSubmit} className="space-y-6">
            <Div className="space-y-2">
              <Label htmlFor="name" />Full Name</HTMLInputElement>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className="bg-black/50 border-white/20"
                placeholder="John Doe"
                autoComplete="name"
              />
              {errors.name && <P className="text-xs text-red-400">{errors.name}</Input>}
            </Div>
            
            <Div className="space-y-2">
              <Label htmlFor="email" />Email</Div>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="bg-black/50 border-white/20"
                placeholder="you@example.com"
                autoComplete="email"
              />
              {errors.email && <P className="text-xs text-red-400">{errors.email}</Input>}
            </Div>
            
            <Div className="space-y-2">
              <Label htmlFor="password" />Password</Div>
              <Div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  className="bg-black/50 border-white/20 pr-10"
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
                <Button type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() = /> setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Div>
              </Div>
              {errors.password && <P className="text-xs text-red-400">{errors.password}</P>}
            </Div>
            
            <Div className="space-y-2">
              <Label htmlFor="confirmPassword" />Confirm Password</Div>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="bg-black/50 border-white/20"
                placeholder="••••••••"
                autoComplete="new-password"
              />
              {errors.confirmPassword && <P className="text-xs text-red-400">{errors.confirmPassword}</Input>}
            </Div>
            
            <Div className="space-y-4">
              <Div className="flex items-center space-x-2">
                <Checkbox id="acceptTerms" 
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onCheckedChange={(checked) = /> 
                    setFormData({...formData, acceptTerms: checked as boolean})
                  }
                />
                <Label htmlFor="acceptTerms" className="text-sm" />
                  I agree to the <A href="/terms" className="text-blue-400 hover:underline">Terms of Service</Div> and <A href="/privacy" className="text-blue-400 hover:underline">Privacy Policy</A />
              </A>
              {errors.acceptTerms && <P className="text-xs text-red-400">{errors.acceptTerms}</P>}
              
              <Div className="flex items-center space-x-2">
                <Checkbox id="receiveUpdates" 
                  name="receiveUpdates"
                  checked={formData.receiveUpdates}
                  onCheckedChange={(checked) = /> 
                    setFormData({...formData, receiveUpdates: checked as boolean})
                  }
                />
                <Label htmlFor="receiveUpdates" className="text-sm" />
                  I want to receive trading insights and platform updates
                </Div>
              </Div>
            </Div>
            
            <Button type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
              disabled={isLoading}
>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </button />
        </Button>
        <CardFooter className="flex justify-center border-t border-white/10 pt-6" />
          <P className="text-sm text-gray-400">
            Already have an account?{' '}
            <A href="/auth" className="text-blue-400 hover:underline" /></CardFooter /></CardFooter />Sign In</CardFooter>
          </p />
      </Card>
    </Div>
  );
}

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
}; 