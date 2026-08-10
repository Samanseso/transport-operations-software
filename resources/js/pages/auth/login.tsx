import AppearanceToggleDropdown from '@/components/appearance-dropdown';
import InputError from '@/components/input-error';
import ProjectLogo from '@/components/project-logo';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { home, register } from '@/routes';
import { request } from '@/routes/password';
import { Head, Link, router } from '@inertiajs/react';
import axios from 'axios';
import { CheckCircle2, LoaderCircle, MapPinned, ShieldCheck, Truck } from 'lucide-react';
import { FormEvent, useState } from 'react';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

const platformHighlights = [
    {
        icon: Truck,
        title: 'Fleet readiness',
        description: 'Keep vehicle assignments and driver coordination visible in one place.',
    },
    {
        icon: MapPinned,
        title: 'Live trip awareness',
        description: 'Monitor active transport movements with real-time location context.',
    },
    {
        icon: ShieldCheck,
        title: 'Operational clarity',
        description: 'Manage requests, approvals, and dispatch updates with better control.',
    },
];

const checklist = [
    'Review new reservation requests quickly.',
    'Assign available units with less back-and-forth.',
    'Track active dispatches from the same workspace.',
];

export default function Login({ status, canResetPassword }: LoginProps) {
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setProcessing(true);
        setErrors({});

        const form = new FormData(event.currentTarget);

        try {
            const response = await axios.post('/api/login', {
                email: form.get('email'),
                password: form.get('password'),
                remember: form.get('remember') === 'on',
            });

            const token = response.data?.token;
            if (token) {
                axios.defaults.headers.common.Authorization = `Bearer ${token}`;
            }

            router.visit('/dashboard');
        } catch (error: any) {
            const data = error?.response?.data;
            if (data?.errors) {
                const nextErrors: Record<string, string> = {};
                Object.entries<string[]>(data.errors).forEach(([key, value]) => {
                    nextErrors[key] = value?.[0] ?? 'Invalid input.';
                });
                setErrors(nextErrors);
            } else if (data?.message) {
                setErrors({ email: data.message });
            } else {
                setErrors({ email: 'Login failed. Please try again.' });
            }
        } finally {
            setProcessing(false);
        }
    };

    return (
        <>
            <Head title="Log in" />

            <div className="min-h-screen bg-slate-950 transition-colors duration-200">
                <div className="grid min-h-screen lg:grid-cols-[1.1fr_0.9fr]">
                    <section className="relative hidden overflow-hidden lg:flex">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(245,158,11,0.20),transparent_35%),linear-gradient(160deg,#020617_0%,#0f172a_48%,#111827_100%)]" />
                        <div className="absolute inset-y-10 right-10 w-72 rounded-full bg-amber-500/10 blur-3xl" />

                        <div className="relative flex w-full flex-col justify-between p-10 xl:p-14">
                            <Link href={home()} className="flex items-center gap-4">
                                <ProjectLogo className="w-16 drop-shadow-md" />
                                <div>
                                    <p className="text-xs font-semibold tracking-[0.32em] text-amber-300 uppercase">Transport</p>
                                    <h1 className="text-xl font-semibold tracking-tight text-white">Operations Software</h1>
                                </div>
                            </Link>

                            <div className="max-w-2xl space-y-8">
                                <div className="space-y-5">
                                    <div className="space-y-4">
                                        <h2 className="mt-3 text-5xl font-semibold tracking-tight text-balance text-white">
                                            Keep reservations, dispatches, and fleet movement in sync.
                                        </h2>
                                        <p className="max-w-xl text-lg leading-8 text-slate-300">
                                            Sign in to manage the full daily transport workflow, from request intake to active trip monitoring and
                                            vehicle coordination.
                                        </p>
                                    </div>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-3">
                                    {platformHighlights.map(({ icon: Icon, title, description }) => (
                                        <article key={title} className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-400/10 text-amber-300">
                                                <Icon className="h-5 w-5" />
                                            </div>
                                            <h3 className="mt-4 text-base font-semibold text-white">{title}</h3>
                                            <p className="mt-2 text-sm leading-6 text-slate-300">{description}</p>
                                        </article>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-5 max-w-2xl rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur">
                                <p className="text-sm font-medium tracking-[0.28em] text-slate-300 uppercase">What you can do after login</p>
                                <div className="mt-5 space-y-3">
                                    {checklist.map((item) => (
                                        <div key={item} className="flex items-start gap-3">
                                            <div className="mt-0.5 rounded-full bg-emerald-400/20 p-1 text-emerald-300">
                                                <CheckCircle2 className="h-4 w-4" />
                                            </div>
                                            <p className="text-sm leading-6 text-slate-200">{item}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="relative flex items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(245,158,11,0.10),transparent_30%),linear-gradient(180deg,#fffdf7_0%,#f8fafc_42%,#eef2ff_100%)] px-6 py-10 transition-colors duration-200 sm:px-8 dark:bg-[radial-gradient(circle_at_top,_rgba(245,158,11,0.12),transparent_35%),linear-gradient(180deg,#090d16_0%,#0f172a_50%,#020617_100%)]">
                        <div className="absolute top-4 right-4 z-50 sm:top-6 sm:right-6">
                            <AppearanceToggleDropdown />
                        </div>

                        <div className="w-full max-w-md">
                            <Link href={home()} className="mb-8 flex items-center gap-4 lg:hidden">
                                <ProjectLogo className="w-14 drop-shadow-sm" />
                                <div>
                                    <p className="text-xs font-semibold tracking-[0.32em] text-amber-600 dark:text-amber-400 uppercase">Transport</p>
                                    <h2 className="text-lg font-semibold tracking-tight text-slate-950 dark:text-white">Operations Software</h2>
                                </div>
                            </Link>

                            <div className="rounded-[2rem] border border-slate-200/80 bg-white/95 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur transition-colors duration-200 sm:p-10 dark:border-slate-800/80 dark:bg-slate-900/90 dark:shadow-[0_24px_80px_rgba(0,0,0,0.6)]">
                                <div className="space-y-3">
                                    <div className="space-y-2">
                                        <h3 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">Welcome back</h3>
                                        <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
                                            Sign in to access your transport operations dashboard.
                                        </p>
                                    </div>
                                </div>

                                {status && (
                                    <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300">
                                        {status}
                                    </div>
                                )}

                                <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-6">
                                    <div className="grid gap-5">
                                        <div className="grid gap-2">
                                            <Label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                Email address
                                            </Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                name="email"
                                                required
                                                autoFocus
                                                tabIndex={1}
                                                autoComplete="email"
                                                placeholder="email@example.com"
                                                className="h-11 rounded-xl border-slate-200 bg-white text-slate-900 shadow-none placeholder:text-slate-400 focus-visible:ring-amber-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus-visible:ring-amber-500"
                                            />
                                            <InputError message={errors.email} />
                                        </div>

                                        <div className="grid gap-2">
                                            <div className="flex items-center">
                                                <Label htmlFor="password" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                    Password
                                                </Label>
                                                {canResetPassword && (
                                                    <TextLink
                                                        href={request()}
                                                        className="ml-auto text-sm text-slate-600 decoration-slate-300 hover:text-slate-950 dark:text-slate-400 dark:decoration-slate-700 dark:hover:text-amber-400"
                                                        tabIndex={5}
                                                    >
                                                        Forgot password?
                                                    </TextLink>
                                                )}
                                            </div>
                                            <Input
                                                id="password"
                                                type="password"
                                                name="password"
                                                required
                                                tabIndex={2}
                                                autoComplete="current-password"
                                                placeholder="Password"
                                                className="h-11 rounded-xl border-slate-200 bg-white text-slate-900 shadow-none placeholder:text-slate-400 focus-visible:ring-amber-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus-visible:ring-amber-500"
                                            />
                                            <InputError message={errors.password} />
                                        </div>

                                        <div className="flex items-center space-x-3">
                                            <Checkbox
                                                id="remember"
                                                name="remember"
                                                tabIndex={3}
                                                className="border-slate-300 data-[state=checked]:border-slate-900 data-[state=checked]:bg-slate-900 dark:border-slate-700 dark:data-[state=checked]:border-amber-500 dark:data-[state=checked]:bg-amber-500"
                                            />
                                            <Label htmlFor="remember" className="text-sm text-slate-600 dark:text-slate-300">
                                                Remember me on this device
                                            </Label>
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="mt-2 h-11 w-full rounded-xl bg-slate-950 text-base font-medium text-white transition hover:bg-slate-800 dark:bg-amber-500 dark:font-semibold dark:text-slate-950 dark:hover:bg-amber-400"
                                        tabIndex={4}
                                        disabled={processing}
                                    >
                                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                        Log in
                                    </Button>

                                    <div className="text-center text-sm text-slate-600 dark:text-slate-400">
                                        Don't have an account?{' '}
                                        <TextLink href={register()} className="font-medium text-slate-950 decoration-slate-300 dark:text-amber-400 dark:decoration-slate-700" tabIndex={5}>
                                            Sign up
                                        </TextLink>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}
