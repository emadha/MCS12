import SingleCarDetailBox from '@/Pages/Database/Cars/Components/SingleCarDetailBox'
import PageContainer from '@/Layouts/PageContainer'
import OutlineButton from '@/Components/Form/Buttons/OutlineButton'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { Link } from '@inertiajs/react'

export default function ByTrim ({
    title, car, make_slug, model_slug, series_slug,
}) {
    return <PageContainer title={title}>

        <Link href={route('database.cars.series', [make_slug, model_slug, series_slug])}>
            <OutlineButton icon={faArrowLeft} className={'-mt-10 mb-10 mx-auto'}>
                Go Back
            </OutlineButton>
        </Link>

        <div className={'flex w-full justify-center'}>

            <div className={'w-full text-xs'}>
                <SingleCarDetailBox car={car}/>
            </div>
        </div>
    </PageContainer>
}
