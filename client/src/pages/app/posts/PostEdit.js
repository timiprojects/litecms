import React, { useEffect, useState, useCallback } from 'react';
import PageHeader from '../../../components/page.header';
import Form from '../../../components/Forms.comp';
import { useParams, useHistory } from 'react-router-dom';
import useGet from '../../../hooks/useGet';
import { post as postSchema } from '../../../validators/validate';
import useForm from '../../../hooks/useForm';
import useFetch from '../../../hooks/useFetch';
import { useApp } from '../../../providers/App.context';

export default () => {

    const { categories } = useApp()

    const { id } = useParams()

    const { goBack } = useHistory()

    const [getPost, postData] = useGet(`/posts/edit/${id}`, 'get')

    const [file, setFile] = useState(null)

    const [state, handleChange, errors, _set] = useForm((postData) ? {...postData.data, categories: categories, category: [], files: null, } : {}, postSchema)

    useEffect(() => {
        let mounted = true
        if(mounted){
            getPost()
        }

        return () => mounted = false;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const _setFile = useCallback((object) => {
        setFile(object)
    }, [])

    useEffect(() => {
        let mounted = true
        if(mounted) {
            if (postData) {
                const {data} = postData
                const { title, content, category, coverImagePath } = data
                categories && postData && _set({ title, content, category, coverImagePath, categories: categories, files: file && file})
            }
        }

        return () => mounted = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [categories, postData, file])

    const [fetch, response, loading] = useFetch(`/posts/edit/${id}`, 'put')

    const updatePost = e => {
        e.preventDefault()
        fetch(state)
    }

    useEffect(() => {
        let mounted = true
        if(mounted){
            if(response && response.redirect) {
                goBack()
            }
        }
        return () => mounted = false;
    }, [response, goBack])

    // useEffect(() => {
    //     console.log(state.files)
    // }, [state])

    return (
        <div className="pages">
            <PageHeader pageTitle={`edit post`} showbutton={false} />
            <div className="pages-content">
                <Form.PostForm state={state} change={handleChange} errors={errors} loading={loading} submit={updatePost} setfile={_setFile} />
            </div>
        </div>
    )
}
