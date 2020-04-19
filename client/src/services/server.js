import { baseURL, Api } from '../services/Api.services';
import shortid from 'shortid'

const server = {
    process: (fieldName, file, metadata, load, error, progress, abort, transfer, options) => {

        const shortId = shortid.generate()

        const formData = { shortId, fieldName, file, fileName: file.name }

        Api.post(`${baseURL}/posts/images`, JSON.stringify(formData))
            .then(ress => {
                console.log(ress)
                ress.request.onprogress = e => {
                    progress(e.lengthComputable, e.load, e.total)
                }

                ress.request.onload = () => {
                    if (ress.status >= 200 && ress.status < 300) {
                        load(ress.data.shortId)
                        console.log(ress.data.shortId)
                    } else {
                        error("YIKES!! ERROR!!!")
                    }
                }
            })
            .catch(e => console.log(e))

        return {
            abort: () => {
                abort()
            }
        }
    },
    load: (source, load, error, progress, abort, headers, fetch) => {
        // reset our progress
        progress(true, 0, 1024)

        Api.get(`${baseURL}/posts/images`, {shortId: source})
            .then(ress => {
                console.log(ress)
                load(ress.request.data)
            })
            .catch(e => {
                error(e.message)
                abort()
            })

        return {
            abort: () => {
                abort()
            }
        }
    },
    fetch: (url, load, error, progress, abort, headers) => {
        // reset our progress
        progress(true, 0, 1024)

        Api.get(url)
            .then(ress => {
                console.log(ress)
                load(ress.request.data)
            })
            .catch(e => {
                error(e.message)
                abort()
            })

        return {
            abort: () => {
                abort()
            }
        }
    }
}

export default server