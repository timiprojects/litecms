import React, { useRef, useEffect } from 'react'
// import { FilePond } from 'react-filepond';
import * as FilePond from 'filepond';

const TextBox = ({ name, change, disabled, value, type, placeholder, error }) => {
    return (
        <>
            <div className="form-group">
                <input
                    value={value || ''}
                    type={type || 'text'}
                    className={`form-input`}
                    disabled={disabled}
                    placeholder={placeholder || ''}
                    onChange={change}
                    name={name}
                    id={name} />
                {!disabled && error && <p className="text-danger text-left">{error}</p>}
            </div>
        </>
    )
}

const PostForm = ({ state, change, errors, submit, setfile }) => {

    const myPond = useRef()

    useEffect(() => {
        let mounted = true
        if (mounted) {
            FilePond.create(myPond.current, {
                allowMultiple: false,
                styleItemPanelAspectRatio: 50 / 100,
                imageResizeTargetWidth: 256,
                allowFileEncode: true,

                onaddfile: (err, file) => {
                    if (err) return;
                    setfile({
                        "id": file.id,
                        "name": file.filename,
                        "type": file.fileType,
                        "size": file.fileSize,
                        "metadata": file.getMetadata(),
                        "data": file.getFileEncodeBase64String()
                    })
                },
                onremovefile: (err, file) => {
                    if (err) return;
                    setfile(null)
                }
            })
        }

        return () => mounted = false;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <form className="postform" onSubmit={submit} name="postform">
            <div className="left">
                <div className="postform-group">
                    <input type="text" placeholder="Enter Title" className="postform-input" name="title" value={state.title || ''} onChange={change} />
                    {errors && <p className="text-danger text-left">{errors["title"]}</p>}
                </div>
                <div className="postform-group">
                    <textarea type="text" placeholder="Place content here.." className="postform-input" name="content" value={state.content || ''} onChange={change}></textarea>
                    {errors && <p className="text-danger text-left">{errors["content"]}</p>}
                </div>
            </div>
            <div className="right">
                <div className="card">
                    <p className="card-header">Cover Image</p>
                    <div className="card-body" id="filer">
                        <img src={state.coverImagePath && state.coverImagePath} alt={state.title} className="card-body-img" />
                    </div>
                </div>
                <div className="card">
                    <p className="card-header">Categories</p>
                    <div className="card-body flex">
                        <div className="inner">
                            {state.categories && state.categories.map((cat, index) => {
                                return (
                                    <div className="postform-checkbox" key={cat._id}>
                                        <input type="checkbox" id={cat._id} name="category" value={cat._id} onChange={change} />
                                        <label htmlFor={cat._id}>{cat.title}</label>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
                <div className="card">
                    <p className="card-header">Upload Cover Image</p>
                    <div className="card-body" id="filer">
                        <input type="file" ref={ref => myPond.current = ref} name="filepond" />
                    </div>
                    <div className="card-footer">
                        <button className="button button-peru button-right button-small">publish</button>
                    </div>
                </div>
            </div>
        </form>
    )
}

const CatForm = ({ state, change, submit, errors, loading }) => {
    return (
        <form className="postform" onSubmit={submit}>
            <div className="left">
                <div className="postform-group">
                    <input type="text" placeholder="Enter Title" name="title" className="postform-input" value={state.title || ''} onChange={change} />
                    {errors && <p className="text-danger text-left">{errors["title"]}</p>}
                </div>
                <div className="postform-group">
                    <input type="text" placeholder="Enter slug in lower case" name="slug" className="postform-input" value={state.slug || ''} onChange={change} />
                    {errors && <p className="text-danger text-left">{errors["slug"]}</p>}
                </div>
                <div className="card-footer postform-group">
                    <button className="button button-peru button-right button-small" disabled={loading ? true : false}>{!loading ? 'Publish' : 'Creating...'}</button>
                </div>
            </div>
        </form>
    )
}


const onfocus = e => {
    if (e.target.hasAttribute('readOnly')) {
        e.target.removeAttribute('readOnly');
        // fix for mobile safari to show virtual keyboard
        e.target.blur();
        e.target.focus();
    }
}

const UserForm = ({ state, change, submit, errors, loading, hidePwd }) => {
    return (
        <form className="" onSubmit={submit} autoComplete="hgkjv">
            <div className="left">
                <div className="postform-group">
                    <input type="text" placeholder="Enter Username" name="username" className="postform-input" value={state.username || ''} onChange={change} readOnly onFocus={onfocus} />
                    {errors && <p className="text-danger text-left">{errors["username"]}</p>}
                </div>
                <div className="postform-group">
                    <input type="text" placeholder="Enter Fullname" name="fullname" className="postform-input" value={state.fullname || ''} onChange={change} readOnly onFocus={onfocus} />
                    {errors && <p className="text-danger text-left">{errors["fullname"]}</p>}
                </div>
                <div className="postform-group">
                    <input type="email" placeholder="Enter Email" name="email" className="postform-input" value={state.email || ''} onChange={change} readOnly onFocus={onfocus} />
                    {errors && <p className="text-danger text-left">{errors["email"]}</p>}
                </div>
                <div className="postform-group">
                    <select name="user_role" className="postform-select" onChange={change}>
                        <option value="0">Select Role</option>
                        <option value="ADMIN">Admin</option>
                        <option value="EDITOR">Editor</option>
                        <option value="USER">User</option>
                    </select>
                    {errors && <p className="text-danger text-left">{errors["user_role"]}</p>}
                </div>
                {
                    (hidePwd) ? (
                        <></>
                    ) : (
                            <div className="postform-group">
                                <input type="password" placeholder="Enter Password" name="password" className="postform-input" value={state.password || ''} onChange={change} readOnly onFocus={onfocus} />
                                {errors && <p className="text-danger text-left">{errors["password"]}</p>}
                            </div>
                        )
                }
                <div className="card-footer postform-group">
                    <button className="button button-peru button-right button-small" disabled={loading ? true : false}>{!loading ? 'Publish' : 'Creating...'}</button>
                </div>
            </div>
        </form>
    )
}


const SettingsForm = ({ state, change, errors, submit, setfile }) => {

    const myPond = useRef()

    useEffect(() => {
        let mounted = true
        if (mounted) {
            FilePond.create(myPond.current, {
                allowMultiple: false,
                styleItemPanelAspectRatio: 30 / 90,
                imageResizeTargetWidth: 50,
                allowFileEncode: true,
                allowImageValidateSize: true,
                imageValidateSizeMinWidth: 25,
                imageValidateSizeMaxWidth: 50,
                imageValidateSizeMinHeight: 25,
                imageValidateSizeMaxHeight: 50,

                onaddfile: (err, file) => {
                    if (err) return;
                    // setfile({
                    //     "id": file.id,
                    //     "name": file.filename,
                    //     "type": file.fileType,
                    //     "size": file.fileSize,
                    //     "metadata": file.getMetadata(),
                    //     "data": file.getFileEncodeBase64String()
                    // })
                },
                onremovefile: (err, file) => {
                    if (err) return;
                    // setfile(null)
                }
            })
        }

        return () => mounted = false;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <form className="postform" onSubmit={submit} name="postform">
            <div className="left">
                <div className="postform-group">
                    <input type="text" placeholder="Enter Site Title" className="postform-input" name="title" value={state.title || ''} onChange={change} />
                    {errors && <p className="text-danger text-left">{errors["title"]}</p>}
                </div>
                <div className="postform-group">
                    <textarea type="text" placeholder="Enter Site Description.." className="postform-input style-one" name="description" value={state.description || ''} onChange={change}></textarea>
                    {errors && <p className="text-danger text-left">{errors["description"]}</p>}
                </div>
            </div>
            <div className="right">
                <div className="card">
                    <p className="card-header">Site Logo</p>
                    <div className="card-body" id="filer">
                        <img src={state.coverImagePath && state.coverImagePath} alt={state.title} className="card-body-img" />
                    </div>
                </div>
                <div className="card">
                    <p className="card-header">Upload Site Logo</p>
                    <div className="card-body" id="filer">
                        <input type="file" ref={ref => myPond.current = ref} name="filepond" />
                    </div>
                    <div className="card-footer">
                        <button className="button button-peru button-right button-small">publish</button>
                    </div>
                </div>
            </div>
        </form>
    )
}


export default {
    TextBox,
    PostForm,
    CatForm,
    UserForm,
    SettingsForm
}
