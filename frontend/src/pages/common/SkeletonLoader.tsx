

interface SkeletonLoaderProps {
    count: number
    height: string
    width?: string
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({count, height, width}) => {
    return (
        <div role="status" className="h-screen p-4 space-y-4 animate-pulse ">
        {[...Array(count)].map((_,i)=> (
            
            <div key={i} className="flex items-center justify-between pt-4">
                <div >
                    <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                    <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                </div>
                <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
            </div>
        ))}
            
        </div>
    )
}

export default SkeletonLoader