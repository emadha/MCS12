import PageContainer from '@/Layouts/PageContainer';
import LoginComponent from '@/Components/LoginComponent';
import {useContext} from 'react';
import {AppContext} from '@/AppContext';

export default function Login({status, canResetPassword, title}) {
    const {lang} = useContext(AppContext);

    return <PageContainer
        className={'mx-auto shadow-sm p-10 max-w-sm px-12'}
        title={lang(title)}
        subtitle={'Login to have access to the full features of MCS'}>

        <div className={'max-w-5xl mx-auto'}>
            <LoginComponent status={status} canResetPassword={canResetPassword}/>
        </div>

    </PageContainer>;
}
