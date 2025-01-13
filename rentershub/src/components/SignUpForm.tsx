'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Building, CheckCircle2 } from 'lucide-react';

interface Role {
  pk: number;
  role: string;
}

const SignUpForm = () => {
  const [step, setStep] = useState(1);
  const [roles, setRoles] = useState<Role[]>([]);
  const [userType, setUserType] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const baseUrl = 'https://rentershubservicev1.onrender.com/api/v1/';

  // Fetch roles from the API
  const fetchRoles = async () => {
    try {
      const response = await axios.get(`${baseUrl}accounts/roles`);
      const filteredRoles = response.data.result.filter(
        (role: { role: string }) => role.role === 'LANDLORD' || role.role === 'GROUNDAGENT'
      );
      setRoles(filteredRoles);
    } catch (error) {
      toast.error('Error fetching roles. Please try again.');
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleRoleSelect = (role: string) => {
    setUserType(role.toLowerCase());
    setStep(2); // Move to phone number step
  };

  const handleSendOtp = async () => {
    if (!phone) {
      toast.warning('Please enter a valid phone number.');
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post(`${baseUrl}accounts/create/otp`, { contact: phone });
      console.log('OTP sent response:', response.data);  // Log the API response here
      toast.success(`An OTP has been sent to ${phone}`);
      setStep(3);
    } catch (error) {
      toast.error('Failed to send OTP. Please try again.');
      console.error('Error sending OTP:', error);
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleVerifyOtp = async () => {
    if (!otp) {
      toast.warning('Please enter the OTP.');
      return;
    }
    setIsLoading(true);
    try {
      await axios.post(`${baseUrl}accounts/verify/otp`, { otp });
      toast.success('Phone number verified successfully.');
      setStep(4);
    } catch (error) {
      toast.error('Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }

    const selectedRole = roles.find((role) => role.role.toLowerCase() === userType);
    if (!selectedRole) {
      toast.warning('Please select your role: Ground Agent or Landlord');
      return;
    }

    const payload = {
      email,
      password,
      first_name: firstName,
      last_name: lastName,
      role: selectedRole.pk,
      contact: `0${phone}`,
      username,
    };

    setIsLoading(true);
    try {
      await axios.post(`${baseUrl}accounts/create/user/`, payload);
      toast.success('Sign-up completed successfully!');
      router.push('/successmessage'); // Redirect to success page
    } catch (error) {
      toast.error('Failed to complete sign-up. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-4">
      <ToastContainer />
      {step === 1 && (
        <div className="space-y-4">
          <Label className="text-lg">I am a...</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {roles.map((role) => (
              <button
                key={role.pk}
                type="button"
                onClick={() => handleRoleSelect(role.role)}
                className={`relative h-40 rounded-lg border-2 p-4 flex flex-col items-center justify-center hover:border-blue-600 transition-all ${
                  userType === role.role.toLowerCase()
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-300'
                }`}
              >
                {role.role === 'GROUNDAGENT' ? (
                  <User
                    className={`w-16 h-16 mb-2 ${
                      userType === 'groundagent' ? 'text-blue-600' : 'text-gray-400'
                    }`}
                  />
                ) : (
                  <Building
                    className={`w-16 h-16 mb-2 ${
                      userType === 'landlord' ? 'text-blue-600' : 'text-gray-400'
                    }`}
                  />
                )}
                <span className="text-lg font-semibold">{role.role}</span>
                {userType === role.role.toLowerCase() && (
                  <CheckCircle2 className="absolute top-2 right-2 w-6 h-6 text-blue-600" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-lg">
              Phone Number
            </Label>
            <div className="flex items-center space-x-2">
              <div className="flex items-center bg-gray-100 px-4 py-2 rounded-l-lg">
                <img src="/kenya-flag.svg" alt="Kenyan Flag" className="w-6 h-6 mr-2" />
                <span>+254</span>
              </div>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter the remaining 9 digits"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, '').slice(0, 9))}
                className="flex-grow py-6 text-lg"
                required
              />
            </div>
          </div>
          <Button
            type="button"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg"
            onClick={handleSendOtp}
            disabled={isLoading}
          >
            {isLoading ? 'Sending OTP...' : 'Send OTP'}
          </Button>
        </form>
      )}

      {step === 3 && (
        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="otp" className="text-lg">
              Enter OTP
            </Label>
            <Input
              id="otp"
              type="text"
              placeholder="Enter the OTP sent to your phone"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="py-6 text-lg"
              required
            />
          </div>
          <Button
            type="button"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg"
            onClick={handleVerifyOtp}
            disabled={isLoading}
          >
            {isLoading ? 'Verifying OTP...' : 'Verify OTP'}
          </Button>
        </form>
      )}

      {step === 4 && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-lg">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-lg">
              First Name
            </Label>
            <Input
              id="firstName"
              type="text"
              placeholder="Enter your first name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-lg">
              Last Name
            </Label>
            <Input
              id="lastName"
              type="text"
              placeholder="Enter your last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="username" className="text-lg">
              Username
            </Label>
            <Input
              id="username"
              type="text"
              placeholder="Enter a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-lg">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-lg">
              Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg"
            disabled={isLoading}
          >
            {isLoading ? 'Signing Up...' : 'Sign Up'}
          </Button>
        </form>
      )}
    </div>
  );
};

export default SignUpForm;
