import { Link } from '@inertiajs/react'
import PageContainer from '@/Layouts/PageContainer'
import OutlineButton from '@/Components/Form/Buttons/OutlineButton'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'

export default function ByMake ({ title, make, make_slug, year, model_slug, models = [] }) {
    return <PageContainer title={title}>

        <Link href={route('database.cars.index')}>
            <OutlineButton icon={faArrowLeft} className={'-mt-10 mb-10 mx-auto'}>
                Go Back
            </OutlineButton>
        </Link>

        <strong>Select Model</strong>
        <ul style={{ columns: 4 }}>
            {models && models.map(model => <li>
                <Link href={'/database/cars/' + make_slug + '/' + year + '/' + model_slug}>
                    {model.model}
                </Link>
            </li>)

            }
        </ul>

    </PageContainer>
}
