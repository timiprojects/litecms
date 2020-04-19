import React, { useEffect, useState, useCallback } from 'react';
import PageHeader from '../../../components/page.header';
import Form from '../../../components/Forms.comp';
import useFetch from '../../../hooks/useFetch';
import useForm from '../../../hooks/useForm';
import { post as postSchema } from '../../../validators/validate';
import { useHistory } from 'react-router-dom';
import { useApp } from '../../../providers/App.context';

export default () => {

    const { categories } = useApp()

    const { goBack } = useHistory()

    const [file, setFile] = useState(null)

    const [state, handleChange, errors, _set] = useForm({
        title: '',
        content: '',
        categories: categories,
        category: [],
        files: ""
    }, postSchema)

    const _setFile = useCallback((object) => {
        setFile(object)
    }, [])

    const [fetch, response] = useFetch('/posts/new', 'post')

    const createPost = e => {
        e.preventDefault()
        fetch(state)
    }

    useEffect(() => {
        let mounted = true
        if (mounted) {
            categories && _set(g => {
                return { ...g, categories: categories, files: file && file }
            })
        }

        return () => mounted = false;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [categories, file])

    useEffect(() => {
        let mounted = true
        if (mounted) {
            if (response && response.redirect) {
                goBack()
            }
        }

        return () => mounted = false;
    }, [response, goBack])

    return (
        <div className="pages">
            <PageHeader pageTitle="Add new Post" showbutton={false} />
            <div className="pages-content">
                <Form.PostForm state={state} change={handleChange} errors={errors} submit={createPost} file={file} setfile={_setFile} />
            </div>
        </div>
    )
}
