import Link from "next/link";

export default function Home() {
    return (
        <div className="flex min-h-screen flex-col bg-zinc-50 font-sans dark:bg-black">
            <header className="w-full px-16 pt-6">
                <div className="flex w-full items-center justify-between">
                    <Link
                        className="text-4xl font-semibold tracking-tight text-black dark:text-zinc-50 hover:text-black dark:hover:text-white"
                        href="/"
                    >
                        paul linca
                    </Link>
                    <nav>
                        <ul className="flex items-center gap-20 text-2xl font-medium text-zinc-700 dark:text-zinc-300">
                            <li>
                                <Link className="hover:text-black dark:hover:text-white" href="/">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link className="hover:text-black dark:hover:text-white" href="/projects">
                                    Projects
                                </Link>
                            </li>
                            <li>
                                <Link className="hover:text-black dark:hover:text-white" href="/blog">
                                    Blog
                                </Link>
                            </li>
                            <li>
                                <Link className="hover:text-black dark:hover:text-white" href="/contact">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>
            </header>
            <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-start px-16 pb-16 pt-6 bg-white dark:bg-black sm:items-start mx-auto">
            </main>
        </div>
    );
}
