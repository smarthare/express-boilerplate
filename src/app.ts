import * as bodyParser from "body-parser";
import * as express from "express";
import * as mongoose from "mongoose";
import * as cors from "cors";
import Controller from "./interfaces/controller.interface";
import errorMiddleware from "./middlewares/error.middleware";
import swaggerDocs from "./utils/swagger";
import logger from "./utils/logger";
import settings from "./config/settings";

class App {
  public app: express.Express;

  constructor(controllers: Controller[]) {
    this.app = express();

    this.connectToTheDatabase();
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.initializeErrorHandling();
  }

  public listen() {
    this.app.listen(settings.PORT, () => {
      logger.info(`App listening on the port ${settings.PORT}`);
      swaggerDocs(this.app, Number(settings.PORT));
    });
  }

  public getServer() {
    return this.app;
  }

  private initializeMiddlewares() {
    this.app.use(bodyParser.json());
    this.app.use(cors({ origin: '*' }));
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  private initializeControllers(controllers: Controller[]) {
    controllers.forEach((controller) => {
      this.app.use("/", controller.router);
    });
  }

  private async connectToTheDatabase() {
    try {
      const {
        MONGO_HOST,
        MONGO_USER,
        MONGO_PASS,
        MONGO_DB,
        NODE_ENV,
      } = settings;

      await mongoose.connect(
        `${NODE_ENV === "development" ? "mongodb" : "mongodb+srv"}://${MONGO_USER ? `${MONGO_USER}:${MONGO_PASS}@` : ''}${MONGO_HOST}/${MONGO_DB}`
      );
      logger.info("DB connected");
    } catch (error) {
      logger.error("Could not connect to db");
      process.exit(1);
    }
  }
}

export default App;
