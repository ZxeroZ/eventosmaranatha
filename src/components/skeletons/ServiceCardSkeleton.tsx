export default function ServiceCardSkeleton() {
    return (
        <div className="relative overflow-hidden rounded-xl md:rounded-2xl lg:rounded-3xl animate-pulse">
            {/* Card skeleton */}
            <div className="relative h-40 sm:h-52 md:h-72 lg:h-80 bg-gray-200">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer" />

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />

                {/* Content skeleton */}
                <div className="absolute inset-0 flex flex-col justify-end p-2 sm:p-4 md:p-6">
                    {/* Number */}
                    <div className="absolute top-2 left-2 md:top-4 md:left-4 w-12 h-12 md:w-16 md:h-16 bg-white/10 rounded" />

                    {/* Title */}
                    <div className="h-4 sm:h-5 md:h-6 w-2/3 bg-white/20 rounded mb-2" />

                    {/* Button */}
                    <div className="h-3 md:h-4 w-20 bg-white/20 rounded" />
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
