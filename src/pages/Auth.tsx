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
import { Eye, EyeOff, Mail, Lock, User, BarChart3, Shield, Zap, ArrowLeft } from 'lucide-react';
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
            const response = await axios.post('http://0.0.0.0:8001/auth/signin', formData, {});
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

            const response = await axios.post('http://0.0.0.0:8001/auth/signup', formData, {});
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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
                {/* Left side - Hero section */}
                <div className="relative hidden h-full flex-col bg-gradient-to-br from-blue-600 to-indigo-700 p-10 text-white lg:flex">
                    <div className="absolute inset-0 bg-black/10" />
                    <div className="relative z-20 flex items-center text-lg font-medium">
                        <BarChart3 className="h-8 w-8 mr-2" />
                        Data Viz Cascade
                    </div>
                    <div className="relative z-20 mt-auto">
                        <blockquote className="space-y-4">
                            <p className="text-xl font-semibold">
                                Transform your data into actionable insights with our powerful visualization platform.
                            </p>
                            <div className="grid grid-cols-1 gap-4 mt-8">
                                <div className="flex items-center space-x-3">
                                    <div className="bg-white/20 p-2 rounded-lg">
                                        <Zap className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Lightning Fast</p>
                                        <p className="text-sm text-blue-100">Generate dashboards in seconds</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="bg-white/20 p-2 rounded-lg">
                                        <Shield className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Secure & Reliable</p>
                                        <p className="text-sm text-blue-100">Your data is safe with us</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="bg-white/20 p-2 rounded-lg">
                                        <BarChart3 className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Advanced Analytics</p>
                                        <p className="text-sm text-blue-100">AI-powered insights and recommendations</p>
                                    </div>
                                </div>
                            </div>
                        </blockquote>
                    </div>
                </div>

                {/* Right side - Auth forms */}
                <div className="lg:p-8">
                    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                        {/* Back to Dashboard link */}
                        <Link to="/" className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Dashboard
                        </Link>

                        <div className="flex flex-col space-y-2 text-center">
                            <h1 className="text-2xl font-semibold tracking-tight">
                                Welcome to Data Viz Cascade
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Sign in to your account or create a new one
                            </p>
                        </div>

                        <Tabs defaultValue="login" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="login">Login</TabsTrigger>
                                <TabsTrigger value="signup">Sign Up</TabsTrigger>
                            </TabsList>

                            <TabsContent value="login" className="space-y-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Login</CardTitle>
                                        <CardDescription>
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
                                                            <FormLabel>Email</FormLabel>
                                                            <FormControl>
                                                                <div className="relative">
                                                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                                    <Input
                                                                        placeholder="Enter your email"
                                                                        className="pl-10"
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
                                                            <FormLabel>Password</FormLabel>
                                                            <FormControl>
                                                                <div className="relative">
                                                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                                    <Input
                                                                        type={showPassword ? "text" : "password"}
                                                                        placeholder="Enter your password"
                                                                        className="pl-10 pr-10"
                                                                        {...field}
                                                                    />
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => setShowPassword(!showPassword)}
                                                                        className="absolute right-3 top-3 h-4 w-4 text-muted-foreground hover:text-foreground"
                                                                    >
                                                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                                    </button>
                                                                </div>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <Button type="submit" className="w-full" disabled={isLoading}>
                                                    {isLoading ? "Signing in..." : "Sign In"}
                                                </Button>
                                            </form>
                                        </Form>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="signup" className="space-y-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Create Account</CardTitle>
                                        <CardDescription>
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
                                                            <FormLabel>Full Name</FormLabel>
                                                            <FormControl>
                                                                <div className="relative">
                                                                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                                    <Input
                                                                        placeholder="Enter your full name"
                                                                        className="pl-10"
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
                                                            <FormLabel>Email</FormLabel>
                                                            <FormControl>
                                                                <div className="relative">
                                                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                                    <Input
                                                                        placeholder="Enter your email"
                                                                        className="pl-10"
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
                                                            <FormLabel>Password</FormLabel>
                                                            <FormControl>
                                                                <div className="relative">
                                                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                                    <Input
                                                                        type={showPassword ? "text" : "password"}
                                                                        placeholder="Create a password"
                                                                        className="pl-10 pr-10"
                                                                        {...field}
                                                                    />
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => setShowPassword(!showPassword)}
                                                                        className="absolute right-3 top-3 h-4 w-4 text-muted-foreground hover:text-foreground"
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
                                                            <FormLabel>Confirm Password</FormLabel>
                                                            <FormControl>
                                                                <div className="relative">
                                                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                                    <Input
                                                                        type={showConfirmPassword ? "text" : "password"}
                                                                        placeholder="Confirm your password"
                                                                        className="pl-10 pr-10"
                                                                        {...field}
                                                                    />
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                                        className="absolute right-3 top-3 h-4 w-4 text-muted-foreground hover:text-foreground"
                                                                    >
                                                                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                                    </button>
                                                                </div>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <Button type="submit" className="w-full" disabled={isLoading}>
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
            </div>
        </div>
    );
};

export default Auth;
