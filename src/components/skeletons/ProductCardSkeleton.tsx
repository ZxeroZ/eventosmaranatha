export default function ProductCardSkeleton() {
    return (
        <div className="group relative animate-pulse">
            {/* Image skeleton */}
            <div className="relative aspect-[4/3] bg-gray-200 rounded-2xl overflow-hidden mb-4">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer" />
            </div>

            {/* Content skeleton */}
            <div className="space-y-3">
                {/* Category badge */}
                <div className="h-5 w-20 bg-gray-200 rounded-full" />

                {/* Title */}
                <div className="h-6 w-3/4 bg-gray-200 rounded" />

                {/* Description lines */}
                <div className="space-y-2">
                    <div className="h-4 w-full bg-gray-200 rounded" />
                    <div className="h-4 w-5/6 bg-gray-200 rounded" />
                </div>
            </div>

            <style jsx>{`
                @keyframes shimmer {
                    0% {
                        transform: translateX(-100%);
                    }
                    100% {
                        transform: translateX(100%);
                    }
                }
                .animate-shimmer {
                    animation: shimmer 2s infinite;
                }
            `}</style>
        </div>
    );
}
