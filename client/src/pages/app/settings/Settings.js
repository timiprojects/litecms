import React, { useEffect } from 'react';
import PageHeader from '../../../components/page.header';
import Form from '../../../components/Forms.comp';
import useForm from '../../../hooks/useForm';

export default () => {

    const [state, handleChange, errors] = useForm({
        title: "",
        description: "",
        files: []
    }, null)

    useEffect(() => {
        let mounted = true
        if(mounted) {
            console.log('true')
        }

        return () => {
            mounted = false;
        }
    }, [])

    return (
        <div className="pages">
            <PageHeader pageTitle="Site Settings" showbutton={false} />
            <div className="pages-content">
                <p>Welcome </p>
                <div className="pages-content">
                    <Form.SettingsForm state={state} change={handleChange} errors={errors}/>
                </div>
            </div>
        </div>
    )
}
