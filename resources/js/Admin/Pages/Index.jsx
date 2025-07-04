export default function Index ({ className, children }) {

    const DashboardBlock = ({ children, title }) =>
        <div className={'p-2 w-full sm:w-1/2 lg:w-1/4 aspect-square'}>
            <div className={'rounded hover:rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer w-full h-full aspect-square p-3 ' +
                'dark:bg-neutral-700 opacity-80 hover:scale-105 hover:opacity-100'}>
                <h2 className={'m-0 text-2xl select-none text-center'}>{title}</h2>
                <div>
                    {children}
                </div>
            </div>
        </div>

    return <div>
        <p className={'my-10'}>Lorem ipsum dolor sit amet, consectetur adipisicing elit. In minus odit quo reprehenderit. Animi, cum error ipsam laboriosam laudantium minima, molestias
            necessitatibus nisi optio, placeat porro quaerat rem! Quod, unde?</p>

        <div className={'w-full flex -mx-2 flex-wrap items-center justify-center'}>

            <DashboardBlock title={'Listed Cars'}>123,459</DashboardBlock>

            <DashboardBlock title={'Sitemap Entries'}>
                <div>123,459 Listed Cars</div>
                <div>70,459 DB Cars</div>
            </DashboardBlock>

            <DashboardBlock title={'Listed Cars'}>123,459</DashboardBlock>
            <DashboardBlock title={'Showrooms'}>123,459</DashboardBlock>
            <DashboardBlock title={'Shops'}>123,459</DashboardBlock>
            <DashboardBlock title={'Users'}>123,459</DashboardBlock>
            <DashboardBlock title={'Total Credits'}>123,459</DashboardBlock>
            <DashboardBlock title={'Listed Cars'}>123,459</DashboardBlock>
            <DashboardBlock title={'Listed Cars'}>123,459</DashboardBlock>
            <DashboardBlock title={'Listed Cars'}>123,459</DashboardBlock>
            <DashboardBlock title={'Listed Cars'}>123,459</DashboardBlock>
            <DashboardBlock title={'Listed Cars'}>123,459</DashboardBlock>
            <DashboardBlock title={'Listed Cars'}>123,459</DashboardBlock>
            <DashboardBlock title={'Listed Cars'}>123,459</DashboardBlock>
            <DashboardBlock title={'Listed Cars'}>123,459</DashboardBlock>

        </div>
    </div>
}
