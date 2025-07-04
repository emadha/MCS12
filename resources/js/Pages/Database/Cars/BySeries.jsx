import { Link } from '@inertiajs/react'
import PageContainer from '@/Layouts/PageContainer'
import OutlineButton from '@/Components/Form/Buttons/OutlineButton'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'

export default function BySeries ({ title, make, make_slug, model, model_slug, trims }) {
    return <PageContainer title={title}>

        <Link href={route('database.cars.model', [make_slug, model_slug])}>
            <OutlineButton icon={faArrowLeft} className={'-mt-10 mb-10 mx-auto'}>
                Go Back
            </OutlineButton>
        </Link>

        {console.log(trims)}
        <strong>Select Trim</strong>
        <ul style={{ columns: 4 }}>
            {trims && trims.map(trim => <li>
                <Link href={'/database/cars/' + make_slug + '/' + trim.model_slug + '/' + trim.series_slug + '/' + trim.trim_slug}>
                    {trim.trim}
                </Link>
            </li>)

            }
        </ul>

    </PageContainer>
}
