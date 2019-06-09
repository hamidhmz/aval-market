//Helmet helps you secure your Express apps by setting various HTTP headers. It's not a silver bullet, but it can help!
import helmet from "helmet";
export default function (app) {// you can also add some middleware that you think you need
    app.use(helmet());
}