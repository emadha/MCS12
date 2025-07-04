import Modal from '@/Components/Modals/Modal'

export default function MessageDialog({className, show, data = {} }) {
    return <Modal className={className} show={show} closeable={true} data={data}>
        {data.content}
    </Modal>
}