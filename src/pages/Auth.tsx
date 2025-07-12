import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, Mail, Lock, User, Shield, Zap, ArrowLeft, BarChart3 } from 'lucide-react';
import axios from '@/lib/axios';

// Validation schemas
const loginSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

const signupSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type LoginFormData = z.infer<typeof loginSchema>;
type SignupFormData = z.infer<typeof signupSchema>;

const Auth = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    // Redirect to home if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    // Test function to manually test authentication
    const testAuth = () => {
        const testUser = {
            user_id: 'test-123',
            email: 'test@example.com',
            name: 'Test User'
        };
        const testToken = 'test-token-123';

        login(testUser, testToken);
        navigate('/');
    };

    const loginForm = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const signupForm = useForm<SignupFormData>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
    });

    const onLogin = async (data: LoginFormData) => {
        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append('email', data.email);
            formData.append('password', data.password);
            const response = await axios.post('/auth/signin', formData, {});
            const result = response.data;
            if (!result || !result.user || !result.access_token) {
                throw new Error('Invalid response format');
            }
            toast({
                title: "Login successful!",
                description: "Welcome back to Data Viz Cascade",
            });
            // Handle different possible response formats
            const user = result.user;
            const token = result.access_token;
            login(user, token);
            navigate('/');
        } catch (error) {
            console.error('Login error:', error);
            toast({
                title: "Login failed",
                description: "Invalid credentials. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const onSignup = async (data: SignupFormData) => {
        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append('name', data.name);
            formData.append('email', data.email);
            formData.append('password', data.password);
            // confirmPassword is not sent to the backend as it's only for client-side validation

            const response = await axios.post('/auth/signup', formData, {});
            const result = response.data;
            toast({
                title: "Account created!",
                description: "Welcome to Data Viz Cascade. Please check your email to verify your account.",
            });

            // Handle different possible response formats
            let user, token;

            if (result.access_token && result.user) {
                user = result.user;
                token = result.access_token;
            } else if (result.access_token) {
                // If only token is returned, create a basic user object
                user = {
                    user_id: result.user_id || 'unknown',
                    email: data.email,
                    name: data.name
                };
                token = result.access_token;
            }
            login(user, token);
            navigate('/');

        } catch (error) {
            console.error('Signup error:', error);
            toast({
                title: "Signup failed",
                description: "Something went wrong. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
            <div className="w-full max-w-md space-y-6">
                {/* Logo */}
                <div className="text-center">
                    <div className="flex items-center justify-center mb-6">
                        <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-teal-400 rounded-lg flex items-center justify-center mr-3">
                            <BarChart3 className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold text-white">TransIQ</span>
                    </div>
                    <h1 className="text-2xl font-semibold tracking-tight text-white mb-2">
                        Welcome to TransIQ
                    </h1>
                    <p className="text-sm text-slate-400">
                        Sign in to your account or create a new one
                    </p>
                </div>

                {/* Back to Dashboard link */}
                <Link to="/" className="flex items-center justify-center text-sm text-slate-400 hover:text-white">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Dashboard
                </Link>

                <Tabs defaultValue="login" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-slate-800 border-slate-700">
                        <TabsTrigger value="login" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-teal-500 data-[state=active]:text-white text-slate-300">Login</TabsTrigger>
                        <TabsTrigger value="signup" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-teal-500 data-[state=active]:text-white text-slate-300">Sign Up</TabsTrigger>
                    </TabsList>

                    <TabsContent value="login" className="space-y-4">
                        <Card className="bg-slate-800/50 border-slate-700">
                            <CardHeader>
                                <CardTitle className="text-white">Login</CardTitle>
                                <CardDescription className="text-slate-400">
                                    Enter your email and password to access your account
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form {...loginForm}>
                                    <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                                        <FormField
                                            control={loginForm.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-white">Email</FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                                            <Input
                                                                placeholder="Enter your email"
                                                                className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                                                                {...field}
                                                            />
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={loginForm.control}
                                            name="password"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-white">Password</FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                                            <Input
                                                                type={showPassword ? "text" : "password"}
                                                                placeholder="Enter your password"
                                                                className="pl-10 pr-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                                                                {...field}
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => setShowPassword(!showPassword)}
                                                                className="absolute right-3 top-3 h-4 w-4 text-slate-400 hover:text-white"
                                                            >
                                                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                            </button>
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <Button type="submit" className="w-full bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white" disabled={isLoading}>
                                            {isLoading ? "Signing in..." : "Sign In"}
                                        </Button>
                                    </form>
                                </Form>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="signup" className="space-y-4">
                        <Card className="bg-slate-800/50 border-slate-700">
                            <CardHeader>
                                <CardTitle className="text-white">Create Account</CardTitle>
                                <CardDescription className="text-slate-400">
                                    Create a new account to get started
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form {...signupForm}>
                                    <form onSubmit={signupForm.handleSubmit(onSignup)} className="space-y-4">
                                        <FormField
                                            control={signupForm.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-white">Full Name</FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                                            <Input
                                                                placeholder="Enter your full name"
                                                                className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                                                                {...field}
                                                            />
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={signupForm.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-white">Email</FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                                            <Input
                                                                placeholder="Enter your email"
                                                                className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                                                                {...field}
                                                            />
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={signupForm.control}
                                            name="password"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-white">Password</FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                                            <Input
                                                                type={showPassword ? "text" : "password"}
                                                                placeholder="Create a password"
                                                                className="pl-10 pr-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                                                                {...field}
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => setShowPassword(!showPassword)}
                                                                className="absolute right-3 top-3 h-4 w-4 text-slate-400 hover:text-white"
                                                            >
                                                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                            </button>
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={signupForm.control}
                                            name="confirmPassword"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-white">Confirm Password</FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                                            <Input
                                                                type={showConfirmPassword ? "text" : "password"}
                                                                placeholder="Confirm your password"
                                                                className="pl-10 pr-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                                                                {...field}
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                                className="absolute right-3 top-3 h-4 w-4 text-slate-400 hover:text-white"
                                                            >
                                                                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                            </button>
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <Button type="submit" className="w-full bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white" disabled={isLoading}>
                                            {isLoading ? "Creating account..." : "Create Account"}
                                        </Button>
                                    </form>
                                </Form>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default Auth;
