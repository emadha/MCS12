import { Link } from '@inertiajs/react'
import PageContainer from '@/Layouts/PageContainer'
import OutlineButton from '@/Components/Form/Buttons/OutlineButton'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'

export default function ByModel ({ title, make, make_slug, series }) {
    return <PageContainer title={title}>

        <Link href={route('database.cars.make', make_slug)}>
            <OutlineButton icon={faArrowLeft} className={'-mt-10 mb-10 mx-auto'}>
                Go Back
            </OutlineButton>
        </Link>

        <strong>Select Series</strong>
        <ul style={{ columns: 4 }}>
            {series && series.map(serie_ => <li>
                <Link href={'/database/cars/'
                    + serie_.make_slug + '/'
                    + serie_.model_slug + '/'
                    + serie_.series_slug}>
                    {serie_.series}
                </Link>
            </li>)
            }
        </ul>

    </PageContainer>
}
