import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
    label: string;
    href?: string;
    current?: boolean;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
    return (
        <nav className="flex mb-6" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3 flex-wrap">
                {/* Inicio */}
                <li className="inline-flex items-center">
                    <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-primary transition-colors">
                        <Home className="w-4 h-4 mr-2" />
                        Inicio
                    </Link>
                </li>

                {items.map((item, index) => (
                    <li key={index} aria-current={item.current ? 'page' : undefined}>
                        <div className="flex items-center">
                            <ChevronRight className="w-4 h-4 text-gray-400 mx-1" />
                            {item.href && !item.current ? (
                                <Link
                                    href={item.href}
                                    className="text-sm font-medium text-gray-500 hover:text-primary transition-colors"
                                >
                                    {item.label}
                                </Link>
                            ) : (
                                <span className="text-sm font-medium text-gray-900 truncate max-w-[200px] sm:max-w-xs">{item.label}</span>
                            )}
                        </div>
                    </li>
                ))}
            </ol>
        </nav>
    );
}
