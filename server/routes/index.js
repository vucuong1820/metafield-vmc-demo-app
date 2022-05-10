import pagesRouter from "./pages.js"

function route(app) {
    app.use('/pages',pagesRouter)
}

export default route
