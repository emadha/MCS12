import ItemBlock from '@/Components/Listing/Components/ItemBlock'
import { Skeleton } from 'antd'

export default function SkeletonListingBlockItem ({
    num = 4, isSidebarOpen = true,
    itemsView = 'list',
}) {
    let SkeletonImages = Array.from([])
    for (let i = 0; i < num; i++) {
        SkeletonImages.push(<ItemBlock key={i}
                                       sidebarOpen={isSidebarOpen}
                                       view={itemsView}><Skeleton
            paragraph={{ rows: 8 }}
            active={true}/></ItemBlock>)
    }
    return SkeletonImages
}
