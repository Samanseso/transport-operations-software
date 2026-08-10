import AppearanceToggleDropdown from '@/components/appearance-dropdown';
import ProjectLogo from '@/components/project-logo';
import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, CheckCircle2, Clock3, MapPinned, ShieldCheck, Truck } from 'lucide-react';

const featureCards = [
    {
        icon: Truck,
        title: 'Fleet coordination',
        description: 'View vehicles, drivers, and assignment readiness from one operational workspace.',
    },
    {
        icon: MapPinned,
        title: 'Live dispatch visibility',
        description: 'Track active trips and location updates without switching between separate tools.',
    },
    {
        icon: ShieldCheck,
        title: 'Operational control',
        description: 'Keep reservations, approvals, and status changes organized and auditable.',
    },
];

const workflowSteps = [
    'Capture reservation requests with clear pickup, delivery, and cargo details.',
    'Assign drivers and vehicles faster using a shared dispatch workflow.',
    'Monitor active trips and keep the whole transport team aligned.',
];

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Transport Operations Software">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700" rel="stylesheet" />
            </Head>

            <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(245,158,11,0.18),transparent_35%),linear-gradient(180deg,#fffdf7_0%,#f8fafc_48%,#eef2ff_100%)] text-slate-950 transition-colors duration-200 dark:bg-[radial-gradient(circle_at_top,_rgba(245,158,11,0.15),transparent_35%),linear-gradient(180deg,#090d16_0%,#0f172a_50%,#020617_100%)] dark:text-white">
                <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 lg:px-8">
                    <div className="flex items-center gap-4">
                        <ProjectLogo className="w-14 drop-shadow-sm sm:w-16" />
                        <div className="min-w-0">
                            <p className="text-xs font-semibold tracking-[0.32em] text-amber-600 uppercase dark:text-amber-400">Transport</p>
                            <h1 className="text-lg font-semibold tracking-tight text-slate-950 sm:text-xl dark:text-white">Operations Software</h1>
                        </div>
                    </div>

                    <nav className="flex items-center gap-3 text-sm">
                        <AppearanceToggleDropdown className="mr-1" />

                        {auth.user ? (
                            <Link
                                href={dashboard()}
                                className="inline-flex items-center rounded-full bg-slate-950 px-5 py-2.5 font-medium text-white transition hover:bg-slate-800 dark:bg-amber-500 dark:font-semibold dark:text-slate-950 dark:hover:bg-amber-400"
                            >
                                Open dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={login()}
                                    className="inline-flex items-center rounded-full border border-slate-300 bg-white/80 px-5 py-2.5 font-medium text-slate-700 backdrop-blur transition hover:border-slate-400 hover:bg-white dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-800"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={register()}
                                    className="hidden items-center rounded-full bg-slate-950 px-5 py-2.5 font-medium text-white transition hover:bg-slate-800 sm:inline-flex dark:bg-amber-500 dark:font-semibold dark:text-slate-950 dark:hover:bg-amber-400"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </nav>
                </header>

                <main className="mx-auto grid max-w-7xl gap-10 px-6 pt-4 pb-14 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 lg:pb-16">
                    <section className="flex flex-col justify-start">
                        <div className="mt-6 space-y-6">
                            <div className="space-y-4">
                                <h2 className="max-w-3xl text-4xl font-semibold tracking-tight text-balance text-slate-950 sm:text-5xl lg:text-6xl dark:text-white">
                                    Coordinate reservations, dispatches, and fleet activity in one place.
                                </h2>
                                <p className="max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
                                    {auth.user
                                        ? `Welcome back, ${auth.user.name}. Continue managing your daily transport operations with real-time visibility and cleaner workflows.`
                                        : 'Built for day-to-day transport operations, this platform brings trip requests, vehicle assignments, driver coordination, and live tracking into a single system.'}
                                </p>
                            </div>

                            <div className="flex flex-col gap-3 sm:flex-row">
                                <Link
                                    href={auth.user ? dashboard() : login()}
                                    className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-base font-medium text-white transition hover:bg-slate-800 dark:bg-amber-500 dark:font-semibold dark:text-slate-950 dark:hover:bg-amber-400"
                                >
                                    {auth.user ? 'Go to dashboard' : 'Log in to continue'}
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                                {!auth.user && (
                                    <Link
                                        href={register()}
                                        className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white/90 px-6 py-3 text-base font-medium text-slate-700 backdrop-blur transition hover:border-slate-400 hover:bg-white dark:border-slate-700 dark:bg-slate-900/90 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-800"
                                    >
                                        Create an account
                                    </Link>
                                )}
                            </div>
                        </div>

                        <div className="mt-10 grid gap-4 md:grid-cols-3">
                            {featureCards.map(({ icon: Icon, title, description }) => (
                                <article
                                    key={title}
                                    className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)] backdrop-blur transition-colors duration-200 dark:border-slate-800/80 dark:bg-slate-900/90 dark:shadow-[0_18px_45px_rgba(0,0,0,0.5)]"
                                >
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
                                        <Icon className="h-6 w-6" />
                                    </div>
                                    <h3 className="mt-5 text-lg font-semibold text-slate-950 dark:text-white">{title}</h3>
                                    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{description}</p>
                                </article>
                            ))}
                        </div>
                    </section>

                    <aside className="relative">
                        <div className="absolute inset-0 -z-10 rounded-[2rem] bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.12),transparent_55%)] blur-3xl" />
                        <div className="overflow-hidden rounded-[2rem] border border-slate-200/80 bg-slate-950 p-7 text-white shadow-[0_28px_80px_rgba(15,23,42,0.25)] sm:p-8 dark:border-slate-800/80">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium tracking-[0.28em] text-amber-300 uppercase">Daily control tower</p>
                                    <h3 className="mt-2 text-2xl font-semibold">Stay ahead of operations</h3>
                                </div>
                                <div className="rounded-2xl bg-white/10 p-3 text-amber-300">
                                    <Clock3 className="h-6 w-6" />
                                </div>
                            </div>

                            <div className="mt-8 grid gap-4 sm:grid-cols-2">
                                <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                                    <p className="text-sm text-slate-300">Core modules</p>
                                    <p className="mt-3 text-3xl font-semibold">Reservations, dispatch, fleet</p>
                                    <p className="mt-3 text-sm leading-6 text-slate-300">
                                        Move from booking intake to active trip monitoring without losing context.
                                    </p>
                                </div>
                                <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                                    <p className="text-sm text-slate-300">Role-ready access</p>
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {['Admin', 'Customer', 'Driver'].map((role) => (
                                            <span key={role} className="rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-white">
                                                {role}
                                            </span>
                                        ))}
                                    </div>
                                    <p className="mt-4 text-sm leading-6 text-slate-300">
                                        Keep each team focused on the actions they need to complete next.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-6">
                                <p className="text-sm font-medium tracking-[0.26em] text-slate-300 uppercase">Workflow snapshot</p>
                                <div className="mt-5 space-y-4">
                                    {workflowSteps.map((step) => (
                                        <div key={step} className="flex items-start gap-3">
                                            <div className="mt-0.5 rounded-full bg-emerald-400/20 p-1 text-emerald-300">
                                                <CheckCircle2 className="h-4 w-4" />
                                            </div>
                                            <p className="text-sm leading-6 text-slate-200">{step}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </aside>
                </main>
            </div>
        </>
    );
}
