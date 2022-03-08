import ejs from 'ejs'
import express, { Response } from 'express'
import path from 'path'
import { ErrorMessages } from 'src/server/constants/messages'
import { publicDir, baseDir, bundles } from 'src/server/utils/environment'

const staticRouter = express.Router()

/**
 * Assets
 */
staticRouter.get(
    /robots\.txt|manifest\.json|favicon\.png|favicon-16x16\.png|favicon-32x32\.png|thumbnail\.png$/,
    (req, res) => {
        const html = `${publicDir}${req.url}`
        res.sendFile(html)
    },
)

staticRouter.get('/static(/*)', (req, res) => {
    res.sendFile(`${baseDir}/client${req.url}`)
})

/**
 * Show react frontend
 *
 * @param {Response} res
 * @return {void}
 */
export const showReact = async (res: Response): Promise<void> => {
    const filePath = path.resolve(publicDir, 'index.ejs')
    const bundleData = bundles()
    const html = await ejs
        .renderFile(filePath, {
            js: bundleData.filter((value) => value.endsWith('.js')),
            css: bundleData.filter((value) => value.endsWith('.css')),
        })
        // tslint:disable-next-line: no-console
        .catch((e) => console.error(ErrorMessages.EJS_FAILED, e))

    res.send(html)
}

/**
 * React frontend
 */
staticRouter.use((_, res) => {
    showReact(res)
})

export { staticRouter }
