import React from 'react';

const Skeleton = ({ className, ...props }) => {
    return (
        <div
            className={`animate-pulse bg-gray-200 rounded-md ${className}`}
            {...props}
        />
    );
};

export const PostSkeleton = () => {
    return (
        <div className="bg-white border rounded-lg mb-4">
            <div className="flex items-center justify-between p-3">
                <div className="flex items-center gap-2">
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                </div>
            </div>
            <div className="w-full aspect-square bg-gray-100 animate-pulse"></div>
            <div className="p-3">
                <div className="flex gap-4 mb-2">
                    <Skeleton className="w-6 h-6" />
                    <Skeleton className="w-6 h-6" />
                    <Skeleton className="w-6 h-6" />
                </div>
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-2/3" />
            </div>
        </div>
    )
}

export const ProfileSkeleton = () => {
    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8">
            <div className="flex flex-col md:flex-row gap-8 mb-12">
                <Skeleton className="w-24 h-24 md:w-40 md:h-40 rounded-full" />
                <div className="flex-1 flex flex-col gap-4">
                    <Skeleton className="h-8 w-48" />
                    <div className="flex gap-8">
                        <Skeleton className="h-5 w-16" />
                        <Skeleton className="h-5 w-16" />
                        <Skeleton className="h-5 w-16" />
                    </div>
                    <Skeleton className="h-4 w-64" />
                </div>
            </div>
            <div className="grid grid-cols-3 gap-1 md:gap-7">
                {[1, 2, 3, 4, 5, 6].map(i => (
                    <Skeleton key={i} className="aspect-square w-full" />
                ))}
            </div>
        </div>
    )
}

export default Skeleton;
