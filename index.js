import 'dotenv/config'
import { io } from './src/rest.js'

io.listen(3000, () => {
    console.log('Listening on port 3000')
})