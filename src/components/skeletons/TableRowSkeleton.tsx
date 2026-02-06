interface TableRowSkeletonProps {
    columns?: number;
}

export default function TableRowSkeleton({ columns = 4 }: TableRowSkeletonProps) {
    return (
        <tr className="animate-pulse">
            {Array.from({ length: columns }).map((_, i) => (
                <td key={i} className="px-6 py-4">
                    <div className="h-4 bg-gray-200 rounded w-full" />
                </td>
            ))}
        </tr>
    );
}
