import My from '@/Layouts/My'
import { usePage } from '@inertiajs/react'

export default function Index({className, children}) {
    const user = usePage().props.auth?.user;
    return <My user={user}>
        Index My
    </My>
}
