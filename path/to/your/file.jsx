<PaginationCarousel
    items={showrooms}
    itemsPerPage={3}
    renderItem={(showroom) => <ShopBlock shop={showroom} variant={'wide'} />}
    className="my-6"
    showDots={true}
    autoplay={true}
    autoplaySpeed={7000}
/>
