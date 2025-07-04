import React, { useContext } from 'react'
import { AppContext } from '@/AppContext'
import PrimaryButton from '@/Components/Form/Buttons/PrimaryButton'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'
import Field from '@/Components/Form/Field'
import TextInput from '@/Components/Form/TextInput'
import Hr from '@/Components/Hr'

export default function ShopFormInitialStep ({ className, setData = () => {}, stops = [], currentStop = 0 }) {
    const { lang } = useContext(AppContext)
    return <>
        <div className={'flex flex-wrap item-center justify center max-w-lg mx-auto text-center'}>
            <div className={'w-full'}>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam, corporis, deleniti, dolore doloremque exercitationem facere facilis fugit ipsam molestiae nam
                necessitatibus placeat qui reprehenderit similique unde velit voluptas. Quae, tempore.
            </div>
            <Hr className={'!my-12 '}/>
            <Field className={'w-full'} title={lang('Choose Stop title')} legendClassName={'justify-center flex !text-center !mx-auto block'}>
                <TextInput
                    className={'w-full'}
                    inputClassName={'text-center'}
                    name={'title'}
                    handleChange={e => setData('name', e.target.value)}
                    placeholder={lang('Shop Title...')}
                />
            </Field>
            <div className={'w-full text-center flex justify-center mt-10'}>
                <PrimaryButton size={'lg'} icon={faChevronRight}>Next</PrimaryButton>
            </div>

        </div>
    </>
}
