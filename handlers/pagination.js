function pagination(model, isUsers=false){
    return async (req, res, next) => {
        const { page, limit } = req.query

        let _page = parseInt(page)
        let _limit = parseInt(limit)

        const results = {}

        const startIndex = (_page - 1) * _limit
        const endIndex = _page * _limit

        const docCount = await model.countDocuments()

        const pages = Math.ceil(docCount / _limit)

        results.pages = pages

        if(endIndex < docCount) {
            results.next = {
                page: _page + 1,
                limit: _limit
            }
        }

        if (startIndex > 0) {
            results.previous = {
                page: _page - 1,
                limit: _limit
            }
        }

        try {
            results.total = docCount
            if(isUsers) {
                const _usr = await model.find({}).select({_id:1, username:1, user_role:1, fullname:1, email:1, updatedAt: 1}).limit(_limit).skip(startIndex)
                results.result = _usr.sort((a,b) => b > a)
            } else {
                const _res = await model.find({}).limit(_limit).skip(startIndex)
                results.result = _res.sort((a, b) => b.updatedAt < a.updatedAt).reverse()
            }
            res.paginatedResults = results
            next()
        } catch (e) {
            res.status(500).json({message: "Something is wrong somewhere!"})
        }
    }
}

module.exports = pagination